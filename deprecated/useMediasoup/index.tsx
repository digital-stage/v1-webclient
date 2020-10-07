import React, {useCallback, useEffect, useReducer, useState} from "react";
import {Producer, Router} from "../../lib/digitalstage/common/model.common";
import {useDevices} from "../../lib/digitalstage/useDevices";
import io from "socket.io-client";
import {ClientDeviceEvents, ServerStageEvents} from "../../lib/digitalstage/common/events";
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
import ClientModel from "../../lib/digitalstage/common/model.client";
import {StageMemberAudioProducerId, StageMemberVideoProducerId} from "../../lib/digitalstage/common/model.server";


export interface MediasoupContextProps {
    working: boolean;
    localProducers: ClientModel.LocalProducer[];
    localVideoConsumers: ClientModel.LocalVideoConsumer[];
    localAudioConsumers: ClientModel.LocalAudioConsumer[];
    remoteOvTracks: ClientModel.RemoteOvTrack[];
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
    const [localProducers, setLocalProducers] = useState<ClientModel.LocalProducer[]>([]);

    // Remote offers
    const [remoteOvTracks, setRemoteOvTracks] = useState<ClientModel.RemoteOvTrack[]>([]);
    const [localAudioConsumers, setLocalAudioConsumers] = useState<ClientModel.LocalAudioConsumer[]>([]);
    const [localVideoConsumers, setLocalVideoConsumers] = useState<ClientModel.LocalVideoConsumer[]>([]);
    const [remoteProducers, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "add_video":
                console.log("ADD_VIDEO_PRODUCER");
                console.log(action.payload);
                const videoProducer: ClientModel.RemoteVideoProducer = action.payload;
                console.log("dispatch: add video " + videoProducer._id);
                if (router && device && receiveTransport && localDevice) {
                    if (localDevice.receiveVideo) {
                        setWorking(true);
                        createConsumer(connection, device, receiveTransport, videoProducer)
                            .then(consumer => {
                                if (consumer.paused)
                                    return resumeConsumer(connection, consumer);
                                return consumer;
                            })
                            .then(consumer => {
                                setLocalVideoConsumers(prevState => [...prevState, {
                                    remoteProducer: videoProducer,
                                    msConsumer: consumer
                                }]);
                            })
                            .catch(error => console.log(error))
                            .finally(() => setWorking(false));
                    }
                }
                return {
                    ...state,
                    video: [...state.video, videoProducer]
                }
            case "add_audio":
                console.log("ADD_AUDIO_PRODUCER");
                console.log(action.payload);
                const audioProducer: ClientModel.RemoteAudioProducer = action.payload;
                console.log("dispatch: add " + audioProducer._id);
                if (router && device && receiveTransport && localDevice) {
                    if (localDevice.receiveAudio) {
                        setWorking(true);
                        createConsumer(connection, device, receiveTransport, audioProducer)
                            .then(consumer => {
                                if (consumer.paused)
                                    return resumeConsumer(connection, consumer);
                                return consumer;
                            })
                            .then(consumer => {
                                setLocalAudioConsumers(prevState => [...prevState, {
                                    remoteProducer: audioProducer,
                                    msConsumer: consumer
                                }]);
                            })
                            .catch(error => console.log(error))
                            .finally(() => setWorking(false));
                    }
                }
                return {
                    ...state,
                    audio: [...state.audio, audioProducer]
                }
            case "add_many_audio":
                console.log("dispatch: add_many_audio ");
                const audioProducers: ClientModel.RemoteAudioProducer[] = action.payload;
                if (localDevice) {
                    setWorking(true);
                    Promise.all(audioProducers.map(producer => {
                        if (localDevice.receiveAudio) {
                            return createConsumer(connection, device, receiveTransport, producer)
                                .then(consumer => {
                                    if (consumer.paused)
                                        return resumeConsumer(connection, consumer);
                                    return consumer;
                                })
                                .then(consumer => {
                                    setLocalAudioConsumers(prevState => [...prevState, {
                                        remoteProducer: producer,
                                        msConsumer: consumer
                                    }]);
                                })
                                .catch(error => console.log(error))
                        }
                    }))
                        .finally(() => setWorking(false));
                }
                return {
                    ...state,
                    audio: [...state.audio, ...audioProducers]
                }
            case "add_many_video":
                console.log("dispatch: add_many ");
                const videoProducers: ClientModel.RemoteVideoProducer[] = action.payload;
                if (localDevice) {
                    setWorking(true);
                    Promise.all(videoProducers.map(producer => {

                        if (localDevice.receiveVideo) {
                            return createConsumer(connection, device, receiveTransport, producer)
                                .then(consumer => {
                                    if (consumer.paused)
                                        return resumeConsumer(connection, consumer);
                                    return consumer;
                                })
                                .then(consumer => {
                                    setLocalVideoConsumers(prevState => [...prevState, {
                                        remoteProducer: producer,
                                        msConsumer: consumer
                                    }]);
                                })
                                .catch(error => console.log(error))
                        }
                    }))
                        .finally(() => setWorking(false));
                }
                return {
                    ...state,
                    video: [...state.video, ...videoProducers]
                }
            case "update_audio":
                const updateAudio: Partial<ClientModel.RemoteAudioProducer> = action.payload;
                console.log("dispatch: update " + updateAudio._id);
                setLocalAudioConsumers(prevState => prevState.map(consumer => consumer.remoteProducer._id === updateAudio._id ? {
                    ...consumer,
                    remoteProducer: {
                        ...consumer.remoteProducer,
                        ...updateAudio
                    }
                } : consumer));
                return {
                    ...state,
                    audio: state.audio.map(p => p._id === updateAudio._id ? {...p, ...updateAudio} : p)
                };
            case "update_video":
                const updateVideo: Partial<ClientModel.RemoteAudioProducer> = action.payload;
                console.log("dispatch: update " + updateVideo._id);
                setLocalVideoConsumers(prevState => prevState.map(consumer => consumer.remoteProducer._id === updateVideo._id ? {
                    ...consumer,
                    remoteProducer: {
                        ...consumer.remoteProducer,
                        ...updateVideo
                    }
                } : consumer));
                return {
                    ...state,
                    video: state.video.map(p => p._id === updateVideo._id ? {...p, ...updateVideo} : p)
                };
            case "remove_audio":
                console.log("dispatch: remove " + action.payload);
                const audioId: StageMemberAudioProducerId = action.payload;
                const audioConsumer = localAudioConsumers.find(consumer => consumer.remoteProducer._id === audioId);
                if (audioConsumer) {
                    setWorking(true);
                    closeConsumer(connection, audioConsumer.msConsumer)
                        .catch(error => console.error(error))
                        .finally(() => {
                            setLocalAudioConsumers(prevState => prevState.filter(c => c.remoteProducer._id !== audioId));
                            setWorking(false);
                        });
                }
                return {
                    ...state,
                    audio: state.audio.filter(i => i._id !== audioId)
                }
            case "remove_video":
                console.log("dispatch: remove " + action.payload);
                const videoId: StageMemberVideoProducerId = action.payload;
                const videoConsumer = localVideoConsumers.find(consumer => consumer.remoteProducer._id === videoId);
                if (videoConsumer) {
                    setWorking(true);
                    closeConsumer(connection, videoConsumer.msConsumer)
                        .catch(error => console.error(error))
                        .finally(() => {
                            setLocalVideoConsumers(prevState => prevState.filter(c => c.remoteProducer._id !== videoId));
                            setWorking(false);
                        });
                }
                return {
                    ...state,
                    video: state.video.filter(i => i._id !== videoId)
                }
            case "receive-audio":
                setWorking(true);
                if (action.payload) {
                    Promise.all(state.video.map(remoteProducer => {
                        console.log("Creating consumer for audio");
                        return createConsumer(connection, device, receiveTransport, remoteProducer)
                            .then(consumer => {
                                if (consumer.paused)
                                    return resumeConsumer(connection, consumer);
                                return consumer;
                            })
                            .then(consumer => {
                                setLocalAudioConsumers(prevState => [...prevState, {
                                    remoteProducer: remoteProducer,
                                    msConsumer: consumer
                                }]);
                            })
                    }))
                        .finally(() => setWorking(false));
                } else {
                    // Remove all video consumers
                    Promise.all(localAudioConsumers.map(consumer => {
                        return closeConsumer(connection, consumer.msConsumer)
                            .finally(() => setLocalAudioConsumers(prevState => prevState.filter(c => c.remoteProducer._id !== consumer.remoteProducer._id)))
                    }))
                        .finally(() => setWorking(false));
                }
                return state;
            case "receive-video":
                setWorking(true);
                if (action.payload) {
                    Promise.all(state.video.map(remoteProducer => {
                        console.log("Creating consumer for video");
                        return createConsumer(connection, device, receiveTransport, remoteProducer)
                            .then(consumer => {
                                if (consumer.paused)
                                    return resumeConsumer(connection, consumer);
                                return consumer;
                            })
                            .then(consumer => {
                                console.log("Adding local consumer");
                                setLocalVideoConsumers(prevState => [...prevState, {
                                    remoteProducer: remoteProducer,
                                    msConsumer: consumer
                                }]);
                            })
                    }))
                        .catch(error => console.error(error))
                        .finally(() => setWorking(false));
                } else {
                    // Remote all video consumers
                    Promise.all(localVideoConsumers.map(consumer => {
                        return closeConsumer(connection, consumer.msConsumer)
                            .finally(() => setLocalVideoConsumers(prevState => prevState.filter(c => c.remoteProducer._id !== consumer.remoteProducer._id)))
                    }))
                        .catch(error => console.error(error))
                        .finally(() => setWorking(false));
                }
                return state;
            case "reset":
                console.log("dispatch: reset");
                setWorking(true);
                Promise.all([
                    localVideoConsumers.map(consumer => closeConsumer(connection, consumer.msConsumer)),
                    localAudioConsumers.map(consumer => closeConsumer(connection, consumer.msConsumer))
                ])
                    .catch(error => console.error(error))
                    .finally(() => {
                        setLocalAudioConsumers([]);
                        setLocalVideoConsumers([]);
                        setWorking(false);
                    });
                return [];
        }
        return state;
    }, {
        audio: [],
        video: []
    });


    useEffect(() => {
        getFastestRouter()
            .then(router => {
                setRouter(router);
                console.log("[useMediasoup] Using router " + router.url);
            })
        return () => {
            setRouter(undefined);
        }
    }, []);

    useEffect(() => {
        if (router) {
            console.log("connecting to " + router.url + ":" + router.port);
            const connection = io("wss://" + router.url + ":" + router.port, {
                secure: true
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
                                    socket.emit(kind === "audio" ? ClientDeviceEvents.ADD_AUDIO_PRODUCER : ClientDeviceEvents.ADD_VIDEO_PRODUCER, {
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
                    socket.emit(producer.kind === "audio" ? ClientDeviceEvents.ADD_AUDIO_PRODUCER : ClientDeviceEvents.REMOVE_VIDEO_PRODUCER, producer._id, () => {
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
            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED, producer => dispatch({
                type: 'add_video',
                payload: producer
            }));
            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED, producer => dispatch({
                type: 'update_video',
                payload: producer
            }));
            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED, producerId => dispatch({
                type: 'remove_video',
                payload: producerId
            }));
            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED, producer => dispatch({
                type: 'add_audio',
                payload: producer
            }));
            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED, producer => dispatch({
                type: 'update_audio',
                payload: producer
            }));
            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED, producerId => dispatch({
                type: 'remove_audio',
                payload: producerId
            }));
            socket.on(ServerStageEvents.STAGE_MEMBER_OV_ADDED, track => setRemoteOvTracks(prevState => [...prevState, track]));
            socket.on(ServerStageEvents.STAGE_MEMBER_OV_CHANGED, track => setRemoteOvTracks(prevState => prevState.map(t => t._id === track._id ? {...t, ...track} : t)));
            socket.on(ServerStageEvents.STAGE_MEMBER_OV_REMOVED, track => setRemoteOvTracks(prevState => prevState.filter(t => t._id !== track._id)));
            socket.on(ServerStageEvents.STAGE_JOINED, (payload: {
                audioProducers: ClientModel.RemoteAudioProducer[];
                videoProducers: ClientModel.RemoteVideoProducer[];
                ovTracks: ClientModel.RemoteOvTrack[];
            }) => {
                dispatch({type: 'add_many_audio', payload: payload.audioProducers});
                dispatch({type: 'add_many_video', payload: payload.videoProducers});
                setRemoteOvTracks(payload.ovTracks);
            });
            socket.on(ServerStageEvents.STAGE_LEFT, (payload: {
                producers: Producer[];
            }) => {
                dispatch({type: 'reset'});
            });
            socket.on("disconnect", () => {
                dispatch({type: 'reset'});
                setLocalProducers([]);
                setLocalAudioConsumers([]);
                setLocalVideoConsumers([]);
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
            localAudioConsumers: localAudioConsumers,
            localVideoConsumers: localVideoConsumers,
            remoteOvTracks: remoteOvTracks
        }}>
            {props.children}
        </MediasoupContext.Provider>
    )
}

export default useMediasoup;