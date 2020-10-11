import React, {useCallback, useEffect, useState} from "react";
import {Client} from "../common/model.client";
import {GlobalAudioProducer, GlobalVideoProducer, Router} from "../common/model.server";
import mediasoupClient from 'mediasoup-client';
import {Device as MediasoupDevice} from "mediasoup-client/lib/Device";
import {
    closeConsumer,
    createConsumer,
    createProducer,
    createWebRTCTransport, getFastestRouter,
    resumeConsumer,
    RouterRequests,
    stopProducer
} from "./util";
import {ClientDeviceEvents} from "../common/events";
import io from "socket.io-client";
import useStageSelector from "../useStageSelector";
import {useStageContext} from "../useStageContext";


export interface MediasoupContextProps {
    working: boolean;
    localAudioProducers: Client.LocalAudioProducer[];
    localVideoProducers: Client.LocalVideoProducer[];
    audioConsumers: Client.StageMemberAudio[];
    videoConsumers: Client.StageMemberVideo[];
}

const MediasoupContext = React.createContext<MediasoupContextProps>(undefined);

export const useMediasoup = (): MediasoupContextProps => React.useContext<MediasoupContextProps>(MediasoupContext);

export const MediasoupProvider = (props: {
    children: React.ReactNode
}) => {
    // Dependencies
    const {socket} = useStageContext();
    const {localDevice, audioProducers, videoProducers} = useStageSelector(state => {
        return {
            audioProducers: state.audioProducers,
            videoProducers: state.videoProducers,
            localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined
        }
    });

    // Connection states
    const [router, setRouter] = useState<Router>();
    const [connection, setConnection] = useState<SocketIOClient.Socket>();

    // Public states
    const [localAudioProducers, setLocalAudioProducers] = useState<Client.LocalAudioProducer[]>([]);
    const [localVideoProducers, setLocalVideoProducers] = useState<Client.LocalVideoProducer[]>([]);
    const [audioConsumers, setAudioConsumers] = useState<{
        [producerId: string]: Client.StageMemberAudio
    }>({});
    const [videoConsumers, setVideoConsumers] = useState<{
        [producerId: string]: Client.StageMemberVideo
    }>({});
    const [working, setWorking] = useState<boolean>(false);

    // Internal state for comparising with server data
    const [sendVideo, setSendVideo] = useState<boolean>(localDevice && localDevice.sendVideo);
    const [sendAudio, setSendAudio] = useState<boolean>(localDevice && localDevice.sendAudio);
    const [receiveAudio, setReceiveAudio] = useState<boolean>(localDevice && localDevice.receiveAudio);
    const [receiveVideo, setReceiveVideo] = useState<boolean>(localDevice && localDevice.receiveVideo);
    const [inputAudioDevice, setInputAudioDevice] = useState<string>(localDevice && localDevice.inputAudioDeviceId);
    const [outputAudioDevice, setOutputAudioDevice] = useState<string>(localDevice && localDevice.outputAudioDeviceId);
    const [inputVideoDevice, setInputVideoDevice] = useState<string>(localDevice && localDevice.inputVideoDeviceId);

    // Mediasoup specific
    const [device, setDevice] = useState<mediasoupClient.types.Device>();
    const [sendTransport, setSendTransport] = useState<mediasoupClient.types.Transport>();
    const [receiveTransport, setReceiveTransport] = useState<mediasoupClient.types.Transport>();

    const consumeVideo = useCallback(() => {
        // Create consumer for all unconsumed audio producers
        setWorking(true);
        Promise.all(videoProducers.allIds.map(videoProducerId => {
            if (!videoConsumers[videoProducerId]) {
                return createConsumer(connection, device, receiveTransport, videoProducers.byId[videoProducerId])
                    .then(consumer => {
                        if (consumer.paused)
                            return resumeConsumer(connection, consumer);
                        return consumer;
                    })
                    .then(consumer => {
                        setVideoConsumers(prevState => ({
                            ...prevState,
                            [videoProducerId]: {
                                ...videoProducers.byId[videoProducerId],
                                msConsumer: consumer
                            }
                        }));
                    })
                    .catch(error => console.log(error))
            }
        }))
            .finally(() => setWorking(false));
    }, [connection, device, videoProducers, videoConsumers, receiveTransport]);

    const stopConsumingVideo = useCallback(() => {
        // Stop consuming all audio producers
        setWorking(true);
        Promise.all(Object.keys(videoConsumers).map(key => {
            const videoConsumer = videoConsumers[key];
            return closeConsumer(connection, videoConsumer.msConsumer)
        }))
            .finally(() => setWorking(false));
    }, [connection, videoConsumers]);

    const consumeAudio = useCallback(() => {
        // Create consumer for all unconsumed audio producers
        setWorking(true);
        Promise.all(audioProducers.allIds.map(audioProducerId => {
            if (!audioConsumers[audioProducerId]) {
                return createConsumer(connection, device, receiveTransport, audioProducers.byId[audioProducerId])
                    .then(consumer => {
                        if (consumer.paused)
                            return resumeConsumer(connection, consumer);
                        return consumer;
                    })
                    .then(consumer => {
                        setAudioConsumers(prevState => ({
                            ...prevState,
                            [audioProducerId]: {
                                ...audioProducers.byId[audioProducerId],
                                msConsumer: consumer
                            }
                        }));
                    })
                    .catch(error => console.log(error))
            }
        }))
            .finally(() => setWorking(false));
    }, [connection, device, audioProducers, audioConsumers, receiveTransport]);

    const stopConsumingAudio = useCallback(() => {
        // Stop consuming all audio producers
        setWorking(true);
        Promise.all(Object.keys(audioConsumers).map(key => {
            const audioConsumer = audioConsumers[key];
            return closeConsumer(connection, audioConsumer.msConsumer)
        }))
            .finally(() => setWorking(false));
    }, [connection, audioConsumers]);

    const startSendingAudio = useCallback(() => {
        console.log("startSendingAudio");
        setWorking(true);
        return navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                deviceId: localDevice.inputAudioDeviceId,
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: false
            },
        })
            .then(stream => stream.getAudioTracks())
            .then(tracks =>
                Promise.all(tracks.map(track => {
                        return createProducer(sendTransport, track)
                            .then(msProducer => {
                                return new Promise(resolve => {
                                    socket.emit(ClientDeviceEvents.ADD_AUDIO_PRODUCER, {
                                        kind: "audio",
                                        routerId: router._id,
                                        routerProducerId: msProducer.id
                                    }, (producer: GlobalAudioProducer) => {
                                        console.log("Created remote producer " + producer._id);
                                        setLocalAudioProducers(prevState => [...prevState, {
                                            ...producer,
                                            msProducer: msProducer
                                        }]);
                                        resolve();
                                    });
                                });
                            })
                    }
                )))
            .finally(() => setWorking(false));
    }, [socket, localDevice, sendTransport, localAudioProducers]);

    const stopSendingAudio = useCallback(() => {
        console.log("stopSendingAudio");
        setWorking(true);
        return Promise.all(localAudioProducers.map(producer => stopProducer(connection, producer.msProducer)
            .then(() => new Promise(resolve => {
                console.log("Removing remote producer " + producer._id);
                socket.emit(ClientDeviceEvents.REMOVE_AUDIO_PRODUCER, producer._id, () => {
                    setLocalAudioProducers(prevState => prevState.filter(p => p._id !== producer._id));
                    resolve();
                });
            }))
        ))
            .finally(() => setWorking(false));
    }, [connection, socket, localDevice, sendTransport, localAudioProducers]);


    const startSendingVideo = useCallback(() => {
        console.log("startSendingVideo");
        setWorking(true);
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
            .then(stream => stream.getVideoTracks())
            .then(tracks =>
                Promise.all(tracks.map(track => {
                        return createProducer(sendTransport, track)
                            .then(msProducer => {
                                return new Promise(resolve => {
                                    socket.emit(ClientDeviceEvents.ADD_VIDEO_PRODUCER, {
                                        kind: "video",
                                        routerId: router._id,
                                        routerProducerId: msProducer.id
                                    }, (producer: GlobalVideoProducer) => {
                                        console.log("Created remote video producer " + producer._id);
                                        setLocalVideoProducers(prevState => [...prevState, {
                                            ...producer,
                                            msProducer: msProducer
                                        }]);
                                        resolve();
                                    });
                                });
                            })
                    }
                )))
            .finally(() => setWorking(false));
    }, [socket, localDevice, sendTransport, localVideoProducers]);

    const stopSendingVideo = useCallback(() => {
        console.log("stopSendingVideo");
        setWorking(true);
        return Promise.all(localVideoProducers.map(producer => stopProducer(connection, producer.msProducer)
            .then(() => new Promise(resolve => {
                console.log("Removing remote video producer " + producer._id);
                socket.emit(ClientDeviceEvents.REMOVE_VIDEO_PRODUCER, producer._id, () => {
                    setLocalVideoProducers(prevState => prevState.filter(p => p._id !== producer._id));
                    resolve();
                });
            }))
        ))
            .finally(() => setWorking(false));
    }, [connection, socket, localDevice, sendTransport, localVideoProducers]);

    useEffect(() => {
        if (socket && connection && !working) {
            if (receiveAudio) {
                consumeAudio();
            } else {
                stopConsumingAudio();
            }
            if (receiveVideo) {
                consumeVideo();
            } else {
                stopConsumingVideo();
            }
        }
    }, [socket, connection, working,
        audioProducers, videoProducers, receiveAudio, receiveVideo]);


    const updateInternalStates = useCallback(() => {
        // Update internal state and perform actions
        if (localDevice.sendAudio && !sendAudio) {
            setSendAudio(localDevice.sendAudio);
            if (localDevice.sendAudio) {
                startSendingAudio();
            } else {
                stopSendingAudio();
            }
        }
        if (localDevice.sendVideo && !sendVideo) {
            setSendVideo(localDevice.sendVideo);
            if (localDevice.sendAudio) {
                startSendingVideo();
            } else {
                stopSendingVideo();
            }
        }
        if (localDevice.receiveAudio && !receiveAudio) {
            setReceiveAudio(localDevice.receiveAudio);
            /*if( localDevice.receiveVideo ) {
                consumeAudio();
            } else {
                stopConsumingAudio();
            }*/
        }
        if (localDevice.receiveVideo && !receiveVideo) {
            setReceiveVideo(localDevice.receiveVideo);
            /*if( localDevice.receiveVideo ) {
                consumeVideo();
            } else {
                stopConsumingVideo();
            }*/
        }
    }, [localDevice, sendAudio, sendVideo, receiveAudio, receiveVideo, startSendingVideo, startSendingAudio, stopSendingVideo, stopSendingAudio])

    useEffect(() => {
        if (socket && connection && sendTransport && receiveTransport && localDevice && !working) {
            updateInternalStates();
        }
    }, [socket, connection, sendTransport, receiveTransport, localDevice, working]);

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
            return () => connection.removeAllListeners()
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
        getFastestRouter()
            .then(router => {
                setRouter(router);
                console.log("[useMediasoup] Using router " + router.url);
            })
        return () => {
            setRouter(undefined);
        }
    }, []);

    return (
        <MediasoupContext.Provider value={{
            working: working,
            localAudioProducers: localAudioProducers,
            localVideoProducers: localVideoProducers,
            audioConsumers: Object.values(audioConsumers),
            videoConsumers: Object.values(videoConsumers),
        }}>
            {props.children}
        </MediasoupContext.Provider>
    )
}

export default useMediasoup;