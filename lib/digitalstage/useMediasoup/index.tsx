import React, {useCallback, useEffect, useReducer, useState} from "react";
import {Producer, ProducerId, Router} from "../common/model.common";
import {useDevices} from "../useDevices";
import io from "socket.io-client";
import {ClientDeviceEvents, ServerStageEvents} from "../common/events";
import mediasoupClient from 'mediasoup-client';
import {Device as MediasoupDevice} from 'mediasoup-client/lib/Device'
import {
    closeConsumer,
    createConsumer,
    createProducer,
    createWebRTCTransport,
    getFastestRouter,
    resumeConsumer,
    RouterRequests,
    stopProducer
} from "./util";
import Client from "../common/model.client";


export interface MediasoupContextProps {
    working: boolean;
    localProducers: Client.LocalProducer[];
    remoteProducers: Producer[];
    localConsumers: Client.LocalConsumer[];
}

const MediasoupContext = React.createContext<MediasoupContextProps>(undefined);

export const useMediasoup = (): MediasoupContextProps => React.useContext<MediasoupContextProps>(MediasoupContext);

export const MediasoupProvider = (props: {
    children: React.ReactNode
}) => {
    const {socket, localDevice} = useDevices();

    const [router, setRouter] = useState<Router>();
    const [connection, setConnection] = useState<SocketIOClient.Socket>();

    const [sendVideo, setSendVideo] = useState<boolean>(localDevice && localDevice.sendVideo);
    const [sendAudio, setSendAudio] = useState<boolean>(localDevice && localDevice.sendAudio);
    const [receiveAudio, setReceiveAudio] = useState<boolean>(localDevice && localDevice.receiveAudio);
    const [receiveVideo, setReceiveVideo] = useState<boolean>(localDevice && localDevice.receiveVideo);

    const [inputAudioDevice, setInputAudioDevice] = useState<string>(localDevice && localDevice.inputAudioDevice);
    const [outputAudioDevice, setOutputAudioDevice] = useState<string>(localDevice && localDevice.outputAudioDevice);
    const [inputVideoDevice, setInputVideoDevice] = useState<string>(localDevice && localDevice.inputVideoDevice);

    const [working, setWorking] = useState<boolean>(false);


    // For mediasoup
    const [device, setDevice] = useState<mediasoupClient.types.Device>();
    const [sendTransport, setSendTransport] = useState<mediasoupClient.types.Transport>();
    const [receiveTransport, setReceiveTransport] = useState<mediasoupClient.types.Transport>();

    // Local producers
    const [localProducers, setLocalProducers] = useState<Client.LocalProducer[]>([]);

    // Remote offers
    const [localConsumers, setLocalConsumers] = useState<Client.LocalConsumer[]>([]);
    const [remoteProducers, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "add":
                const producer: Producer = action.payload;
                console.log("dispatch: add " + producer._id);
                if (router && device && receiveTransport && localDevice) {
                    if ((producer.kind === "audio" && localDevice.receiveAudio) ||
                        producer.kind === "video" && localDevice.receiveVideo) {
                        setWorking(true);
                        createConsumer(connection, device, receiveTransport, producer)
                            .then(consumer => {
                                if (consumer.paused)
                                    return resumeConsumer(connection, consumer);
                                return consumer;
                            })
                            .then(consumer => {
                                setLocalConsumers(prevState => [...prevState, {
                                    remoteProducer: producer,
                                    msConsumer: consumer
                                }]);
                            })
                            .catch(error => console.log(error))
                            .finally(() => setWorking(false));
                    }
                }
                return [...state, producer];
            case "add_many":
                console.log("dispatch: add_many ");
                const producers: Producer[] = action.payload;
                if (localDevice) {
                    setWorking(true);
                    Promise.all(producers.map(producer => {
                        if ((producer.kind === "audio" && localDevice.receiveAudio) ||
                            producer.kind === "video" && localDevice.receiveVideo) {
                            return createConsumer(connection, device, receiveTransport, producer)
                                .then(consumer => {
                                    if (consumer.paused)
                                        return resumeConsumer(connection, consumer);
                                    return consumer;
                                })
                                .then(consumer => {
                                    setLocalConsumers(prevState => [...prevState, {
                                        remoteProducer: producer,
                                        msConsumer: consumer
                                    }]);
                                })
                                .catch(error => console.log(error))
                        }
                    }))
                        .finally(() => setWorking(false));
                }
                return [...state, ...producers];
            case "update":
                const update: Producer = action.payload;
                console.log("dispatch: update " + update._id);
                setLocalConsumers(prevState => prevState.map(consumer => consumer.remoteProducer._id === update._id ? {
                    ...consumer,
                    remoteProducer: {
                        ...consumer.remoteProducer,
                        ...update
                    }
                } : consumer));
                return state.map(p => p._id === update._id ? {...p, ...update} : p);
            case "remove":
                console.log("dispatch: remove " + action.payload);
                const id: ProducerId = action.payload;
                const consumer = localConsumers.find(consumer => consumer.remoteProducer._id === id);
                if (consumer) {
                    setWorking(true);
                    closeConsumer(connection, consumer.msConsumer)
                        .catch(error => console.error(error))
                        .finally(() => {
                            setLocalConsumers(prevState => prevState.filter(c => c.remoteProducer._id !== id));
                            setWorking(false);
                        });
                }
                return state.filter(i => i._id !== id);
            case "receive-audio":
                setWorking(true);
                if (action.payload) {
                    Promise.all(state.filter(remoteProducers => remoteProducers.kind === "audio").map(remoteProducer => {
                        return createConsumer(connection, device, receiveTransport, remoteProducer)
                            .then(consumer => {
                                if (consumer.paused)
                                    return resumeConsumer(connection, consumer);
                                return consumer;
                            })
                            .then(consumer => {
                                setLocalConsumers(prevState => [...prevState, {
                                    remoteProducer: remoteProducer,
                                    msConsumer: consumer
                                }]);
                            })
                    }))
                        .finally(() => setWorking(false));
                } else {
                    // Remote all video consumers
                    Promise.all(localConsumers.filter(consumer => consumer.remoteProducer.kind === "audio").map(consumer => {
                        return closeConsumer(connection, consumer.msConsumer)
                            .finally(() => setLocalConsumers(prevState => prevState.filter(c => c.remoteProducer._id !== consumer.remoteProducer._id)))
                    }))
                        .finally(() => setWorking(false));
                }
                return state;
            case "receive-video":
                setWorking(true);
                if (action.payload) {
                    Promise.all(state.filter(remoteProducers => remoteProducers.kind === "video").map(remoteProducer => {
                        return createConsumer(connection, device, receiveTransport, remoteProducer)
                            .then(consumer => {
                                if (consumer.paused)
                                    return resumeConsumer(connection, consumer);
                                return consumer;
                            })
                            .then(consumer => {
                                console.log("Adding local consumer");
                                setLocalConsumers(prevState => [...prevState, {
                                    remoteProducer: remoteProducer,
                                    msConsumer: consumer
                                }]);
                            })
                    }))
                        .catch(error => console.error(error))
                        .finally(() => setWorking(false));
                } else {
                    // Remote all video consumers
                    Promise.all(localConsumers.filter(consumer => consumer.remoteProducer.kind === "video").map(consumer => {
                        return closeConsumer(connection, consumer.msConsumer)
                            .finally(() => setLocalConsumers(prevState => prevState.filter(c => c.remoteProducer._id !== consumer.remoteProducer._id)))
                    }))
                        .catch(error => console.error(error))
                        .finally(() => setWorking(false));
                }
                return state;
            case "reset":
                console.log("dispatch: reset");
                setWorking(true);
                Promise.all(
                    localConsumers.map(consumer => closeConsumer(connection, consumer.msConsumer))
                )
                    .catch(error => console.error(error))
                    .finally(() => {
                        setLocalConsumers([]);
                        setWorking(false);
                    });
                return [];
        }
        return state;
    }, []);


    useEffect(() => {
        getFastestRouter()
            .then(router => setRouter(router));
        return () => {
            setRouter(undefined);
        }
    }, []);

    useEffect(() => {
        if (router) {
            console.log("connecting to " + router.url + ":" + router.port);
            const connection = io("wss://" + router.url + ":" + router.port, {
                secure: process.env.NODE_ENV !== "development",
            });

            connection.on("connect_error", (error) => {
                console.log(error);
            });

            connection.on("connect_timeout", (error) => {
                console.log(error);
            });

            setConnection(connection);
            return () => {
                connection.close();
            }
        }
    }, [router]);

    useEffect(() => {
        if (connection) {
            connection.emit(RouterRequests.GetRTPCapabilities, {}, (error: string, rtpCapabilities: mediasoupClient.types.RtpCapabilities) => {
                if (error) {
                    return console.error(error);
                }
                // Create device
                const device = new MediasoupDevice();
                device.load({routerRtpCapabilities: rtpCapabilities})
                    .then(() =>
                        // Create transports
                        Promise.all([
                            createWebRTCTransport(connection, device, "send")
                                .then(transport => setSendTransport(transport)),
                            createWebRTCTransport(connection, device, "receive")
                                .then(transport => setReceiveTransport(transport))
                        ])
                    )
                    .then(() => setDevice(device));
            });
        }
    }, [connection]);

    useEffect(() => {
        if (receiveTransport)
            return () => {
                console.log("[useMediasoup] Disconnecting receive transport");
                receiveTransport.close();
            }
    }, [receiveTransport]);

    useEffect(() => {
        if (sendTransport) {
            return () => {
                console.log("[useMediasoup] Disconnecting send transport");
                sendTransport.close();
            }
        }
    }, [sendTransport]);

    const startSending = useCallback((kind: "audio" | "video") => {
        console.log("startSending " + kind);
        setWorking(true);
        return navigator.mediaDevices.getUserMedia({
            video: kind === "video" ? {
                deviceId: localDevice.inputVideoDevice
            } : undefined,
            audio: kind === "audio" ? {
                deviceId: localDevice.inputAudioDevice,
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: false
            } : undefined,
        })
            .then(stream => {
                console.log(stream);
                return stream;
            })
            .then(stream => {
                if (kind === "video") {
                    const videoTracks = stream.getVideoTracks();
                    if (videoTracks.length > 0)
                        return [videoTracks[0]];
                    return [];
                }
                return stream.getAudioTracks();
            })
            .then(tracks =>
                Promise.all(tracks.map(track => {
                        return createProducer(sendTransport, track)
                            .then(msProducer => {
                                return new Promise(resolve => {
                                    socket.emit(ClientDeviceEvents.ADD_PRODUCER, {
                                        kind: kind,
                                        routerId: router._id,
                                        routerProducerId: msProducer.id
                                    }, (producer: Producer) => {
                                        console.log("Created remote producer " + producer._id);
                                        setLocalProducers(prevState => [...prevState, {
                                            ...producer,
                                            msProducer: msProducer
                                        }]);
                                        resolve();
                                    });
                                });
                            })
                    }
                ))
            )
            .finally(() => setWorking(false));
    }, [localDevice, sendTransport, localProducers]);

    const stopSending = useCallback((kind: "audio" | "video") => {
        console.log("stopSending " + kind);
        setWorking(true);
        return Promise.all(localProducers.filter(msProducer => msProducer.kind === kind)
            .map(producer => stopProducer(connection, producer.msProducer)
                .then(() => new Promise(resolve => {
                    console.log("Removing remote producer " + producer._id);
                    socket.emit(ClientDeviceEvents.REMOVE_PRODUCER, producer._id, () => {
                        setLocalProducers(prevState => prevState.filter(p => p._id !== producer._id));
                        resolve();
                    });
                }))
            ))
            .finally(() => setWorking(false));
    }, [connection, localDevice, sendTransport, localProducers]);

    useEffect(() => {
        if (router && device && receiveTransport && sendTransport && localDevice) {
            // Requirements matched
            if (!working) {
                console.log("ready again");
                if (localDevice.sendVideo !== sendVideo) {
                    setSendVideo(localDevice.sendVideo);
                    if (localDevice.sendVideo) {
                        startSending("video");
                    } else {
                        stopSending("video");
                    }
                }
                if (localDevice.sendAudio !== sendAudio) {
                    setSendAudio(localDevice.sendAudio);
                    if (localDevice.sendAudio) {
                        startSending("audio");
                    } else {
                        stopSending("audio");
                    }
                }
                if (localDevice.receiveAudio !== receiveAudio) {
                    setReceiveAudio(localDevice.receiveAudio);
                    dispatch({type: "receive-audio", payload: localDevice.receiveAudio});
                }
                if (localDevice.receiveVideo !== receiveVideo) {
                    setReceiveVideo(localDevice.receiveVideo);
                    dispatch({type: "receive-video", payload: localDevice.receiveVideo});
                }

                if (localDevice.inputAudioDevice !== inputAudioDevice) {
                    setInputAudioDevice(localDevice.inputAudioDevice);
                    if (sendAudio)
                        stopSending("audio")
                            .then(() => startSending("audio"));
                }

                if (localDevice.inputVideoDevice !== inputVideoDevice) {
                    setInputVideoDevice(localDevice.inputVideoDevice);
                    if (sendVideo)
                        stopSending("video")
                            .then(() => startSending("video"));
                }

                if (localDevice.outputAudioDevice !== outputAudioDevice) {
                    setOutputAudioDevice(localDevice.outputAudioDevice);
                    //TODO: Discuss, what to do here
                }
            }
        }

    }, [router, device, receiveTransport, sendTransport, localDevice, working]);

    useEffect(() => {
        if (socket) {
            socket.on(ServerStageEvents.STAGE_PRODUCER_ADDED, producer => dispatch({type: 'add', payload: producer}));
            socket.on(ServerStageEvents.STAGE_PRODUCER_CHANGED, producer => dispatch({
                type: 'update',
                payload: producer
            }));
            socket.on(ServerStageEvents.STAGE_PRODUCER_REMOVED, producerId => dispatch({
                type: 'remove',
                payload: producerId
            }));
            socket.on(ServerStageEvents.STAGE_JOINED, (payload: {
                producers: Producer[];
            }) => {
                dispatch({type: 'add_many', payload: payload.producers});
            });
            socket.on(ServerStageEvents.STAGE_LEFT, (payload: {
                producers: Producer[];
            }) => {
                dispatch({type: 'reset'});
            });
            socket.on("disconnect", () => {
                dispatch({type: 'reset'});
                setLocalProducers([]);
                setLocalConsumers([]);
            })

            return () => {
                console.log("[useMediasoup] Cleaning up");
                dispatch({type: 'reset'});
                setSendAudio(false);
                setSendVideo(false);
                setReceiveAudio(false);
                setReceiveVideo(false);
                setReceiveTransport(undefined);
                setSendTransport(undefined);
                setDevice(undefined);
            }
        }
    }, [socket]);

    return (
        <MediasoupContext.Provider value={{
            working: working,
            localProducers: localProducers,
            remoteProducers: remoteProducers,
            localConsumers: localConsumers
        }}>
            {props.children}
        </MediasoupContext.Provider>
    )
}

export default useMediasoup;