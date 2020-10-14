import React, {useCallback, useEffect, useState} from "react";
import {
    GlobalAudioProducer, GlobalVideoProducer,
    Router
} from "../common/model.server";
import mediasoupClient from "mediasoup-client";
import io from "socket.io-client";
import {
    closeConsumer,
    createConsumer,
    createProducer,
    createWebRTCTransport,
    getFastestRouter,
    resumeConsumer,
    RouterRequests, stopProducer
} from "./util";
import {Device as MediasoupDevice} from "mediasoup-client/lib/Device";
import {ClientDeviceEvents} from "../common/events";
import {AddAudioProducerPayload, AddVideoProducerPayload} from "../common/payloads";
import {useStageDispatch, useStageSocket} from "../useStageContext";
import {AdditionalReducerTypes} from "../useStageContext/reducer";
import {AudioConsumer, Device, VideoConsumer} from "../useStageContext/model";
import {useDispatch, useSelector} from "../useStageContext/redux";
import allActions from "../useStageContext/redux/actions";
import {
    AudioConsumers,
    AudioProducers,
    Devices,
    NormalizedState,
    VideoConsumers,
    VideoProducers
} from "../useStageContext/schema";

const TIMEOUT_MS: number = 4000;

const MediasoupContext = React.createContext(undefined);

export const MediasoupProvider = (props: {
    children: React.ReactNode
}) => {
    const socket = useStageSocket();
    const dispatch = useStageDispatch();

    const localDevice = useSelector<NormalizedState, Device>(state => {
        if (state.devices.local)
            return state.devices.byId[state.devices.local];
        return undefined;
    });
    const audioConsumers = useSelector<NormalizedState, AudioConsumers>(state => state.audioConsumers);
    const videoConsumers = useSelector<NormalizedState, VideoConsumers>(state => state.videoConsumers);
    const videoProducers = useSelector<NormalizedState, VideoProducers>(state => state.videoProducers);
    const audioProducers = useSelector<NormalizedState, AudioProducers>(state => state.audioProducers);

    const [working, setWorking] = useState<boolean>(false);
    const [router, setRouter] = useState<Router>();
    const [connection, setConnection] = useState<SocketIOClient.Socket>();
    const [device, setDevice] = useState<mediasoupClient.types.Device>();
    const [sendTransport, setSendTransport] = useState<mediasoupClient.types.Transport>();
    const [receiveTransport, setReceiveTransport] = useState<mediasoupClient.types.Transport>();
    const [sendVideo, setSendVideo] = useState<boolean>(false);
    const [sendAudio, setSendAudio] = useState<boolean>(false);
    const [receiveVideo, setReceiveVideo] = useState<boolean>(false);
    const [receiveAudio, setReceiveAudio] = useState<boolean>(false);
    const reduxDispatch = useDispatch();

    const [localAudioProducers, setLocalAudioProducers] = useState<{
        audioProducerId: string;
        msProducer: mediasoupClient.types.Producer
    }[]>([]);
    const [localVideoProducers, setLocalVideoProducers] = useState<{
        videoProducerId: string;
        msProducer: mediasoupClient.types.Producer
    }[]>([]);

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


    const startConsumingAudio = useCallback(() => {
        console.log("[useMediasoup] start consuming audio");
        setWorking(true);
        return Promise.all(audioProducers.allIds.map(audioProducerId => {
            if (!audioConsumers.byProducer[audioProducerId]) {
                return createConsumer(connection, device, receiveTransport, audioProducers.byId[audioProducerId])
                    .then(consumer => {
                        if (consumer.paused)
                            return resumeConsumer(connection, consumer);
                        return consumer;
                    })
                    .then(consumer => {
                        dispatch({
                            type: AdditionalReducerTypes.ADD_AUDIO_CONSUMER,
                            payload: {
                                _id: consumer.id,
                                stageMember: audioProducers.byId[audioProducerId].stageMemberId,
                                audioProducer: audioProducerId,
                                msConsumer: consumer
                            } as AudioConsumer
                        });
                        reduxDispatch(allActions.stageActions.client.addAudioConsumer({
                            _id: consumer.id,
                            stage: audioProducers.byId[audioProducerId].stageId,
                            stageMember: audioProducers.byId[audioProducerId].stageMemberId,
                            audioProducer: audioProducerId,
                            msConsumer: consumer
                        }));
                    })
                    .catch(error => console.log(error))
            }
        }))
            .finally(() => setWorking(false));
    }, [connection, device, receiveTransport, audioProducers, audioConsumers]);

    const stopConsumingAudio = useCallback(() => {
        // Stop consuming all audio producers
        console.log("[useMediasoup] stop consuming audio");
        setWorking(true);
        // Assure, that we stop consuming all audio producers
        return Promise.all(audioConsumers.allIds.map(id => {
            if (audioConsumers.byId[id]) {
                return closeConsumer(connection, audioConsumers.byId[id].msConsumer)
                    .then(() => dispatch({
                        type: AdditionalReducerTypes.REMOVE_AUDIO_CONSUMER, payload: id
                    }))
                    .then(() => reduxDispatch(allActions.stageActions.client.removeAudioConsumer(id)))
                    .catch(error => console.log(error))
            }
        }))
            .finally(() => setWorking(false));
    }, [connection, audioConsumers]);

    const startConsumingVideo = useCallback(() => {
        console.log("[useMediasoup] start consuming video");
        setWorking(true);
        return Promise.all(videoProducers.allIds.map(videoProducerId => {
            if (!videoConsumers.byProducer[videoProducerId]) {
                console.log("Creating video producer");
                return createConsumer(connection, device, receiveTransport, videoProducers.byId[videoProducerId])
                    .then(consumer => {
                        if (consumer.paused)
                            return resumeConsumer(connection, consumer);
                        return consumer;
                    })
                    .then(consumer => {
                        dispatch({
                            type: AdditionalReducerTypes.ADD_VIDEO_CONSUMER,
                            payload: {
                                _id: consumer.id,
                                stageMember: videoProducers.byId[videoProducerId].stageMemberId,
                                videoProducer: videoProducerId,
                                msConsumer: consumer
                            } as VideoConsumer
                        });
                        reduxDispatch(allActions.stageActions.client.addVideoConsumer({
                            _id: consumer.id,
                            stage: videoProducers.byId[videoProducerId].stageId,
                            stageMember: videoProducers.byId[videoProducerId].stageMemberId,
                            videoProducer: videoProducerId,
                            msConsumer: consumer
                        }));
                    })
                    .catch(error => console.log(error))
            }
        }))
            .finally(() => {
                console.log("[useMediasoup] Set working = false");
                setWorking(false)
            });
    }, [connection, device, receiveTransport, videoProducers, videoConsumers]);

    const stopConsumingVideo = useCallback(() => {
        // Stop consuming all video producers
        console.log("[useMediasoup] stop consuming video");
        setWorking(true);
        // Assure, that we stop consuming all audio producers
        return Promise.all(videoConsumers.allIds.map(id => {
            if (videoConsumers.byId[id]) {
                return closeConsumer(connection, videoConsumers.byId[id].msConsumer)
                    .then(() => dispatch({
                        type: AdditionalReducerTypes.REMOVE_VIDEO_CONSUMER, payload: id
                    }))
                    .then(() => reduxDispatch(allActions.stageActions.client.removeVideoConsumer(id)))
                    .catch(error => console.log(error))
            }
        }))
            .finally(() => {
                console.log("[useMediasoup] Set working = false");
                setWorking(false)
            });
    }, [connection, videoConsumers]);

    const startStreamAudio = useCallback(() => {
        console.log("[useMediasoup] start streaming audio");
        setWorking(true);
        return navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                deviceId: localDevice ? localDevice.inputAudioDeviceId : undefined,
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: false
            },
        })
            .then(stream => stream.getAudioTracks())
            .then(tracks =>
                Promise.all(tracks.map(track => {
                        return createProducer(sendTransport, track)
                            .then(producer => {
                                return new Promise((resolve, reject) => {
                                    socket.emit(ClientDeviceEvents.ADD_AUDIO_PRODUCER, {
                                        routerId: router._id,
                                        routerProducerId: producer.id
                                    } as AddAudioProducerPayload, (error: string | null, globalProducer: GlobalAudioProducer) => {
                                        if (error) {
                                            console.error(error);
                                            return stopProducer(socket, producer)
                                                .then(() => reject(new Error(error)));
                                        }
                                        setLocalAudioProducers(prevState => [...prevState, {
                                            audioProducerId: globalProducer._id,
                                            msProducer: producer
                                        }]);
                                        resolve();
                                    });
                                    setTimeout(function () {
                                        reject(new Error("Timed out: " + ClientDeviceEvents.ADD_AUDIO_PRODUCER));
                                    }, TIMEOUT_MS)
                                });
                            })
                    }
                )))
            .finally(() => setWorking(false));
    }, [sendTransport, localDevice])

    const stopStreamingAudio = useCallback(() => {
        console.log("[useMediasoup] stop streaming audio");
        setWorking(true);
        // Assure, that we stop streaming all local audio producers
        return Promise.all(localAudioProducers.map(localAudioProducer => {
            return stopProducer(connection, localAudioProducer.msProducer)
                .then(() => {
                    return new Promise((resolve, reject) => {
                        socket.emit(ClientDeviceEvents.REMOVE_AUDIO_PRODUCER, localAudioProducer.audioProducerId, (error?: string) => {
                            console.log("Got response");
                            if (error) {
                                console.error(error)
                                reject(new Error(error));
                            }
                            resolve();
                        });
                        setTimeout(function () {
                            reject(new Error("Timed out: " + ClientDeviceEvents.REMOVE_AUDIO_PRODUCER));
                        }, TIMEOUT_MS)
                    })
                })
                .finally(() => setLocalAudioProducers(prevState => prevState.filter(p => p.audioProducerId !== localAudioProducer.audioProducerId)))
        }))
            .finally(() => setWorking(false));
    }, [localAudioProducers]);


    const startStreamVideo = useCallback(() => {
        console.log("[useMediasoup] start streaming video");
        setWorking(true);
        return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: localDevice && localDevice.inputVideoDeviceId ? {
                deviceId: localDevice.inputVideoDeviceId
            } : true
        })
            .then(stream => stream.getVideoTracks())
            .then(tracks =>
                Promise.all(tracks.map(track => {
                        return createProducer(sendTransport, track)
                            .then(producer => {
                                return new Promise((resolve, reject) => {
                                    socket.emit(ClientDeviceEvents.ADD_VIDEO_PRODUCER, {
                                        routerId: router._id,
                                        routerProducerId: producer.id
                                    } as AddVideoProducerPayload, (error: string | null, globalProducer: GlobalVideoProducer) => {
                                        if (error) {
                                            console.error(error);
                                            return stopProducer(socket, producer)
                                                .then(() => reject(new Error(error)));
                                        }
                                        setLocalVideoProducers(prevState => [...prevState, {
                                            videoProducerId: globalProducer._id,
                                            msProducer: producer
                                        }]);
                                        resolve();
                                    });
                                    setTimeout(function () {
                                        reject(new Error("Timed out: " + ClientDeviceEvents.ADD_VIDEO_PRODUCER));
                                    }, TIMEOUT_MS)
                                });
                            })
                    }
                )))
            .finally(() => {
                console.log("[useMediasoup] Set working = false");
                setWorking(false)
            });
    }, [sendTransport, localDevice])

    const stopStreamingVideo = useCallback(() => {
        console.log("[useMediasoup] stop streaming video");
        setWorking(true);
        // Assure, that we stop streaming all local audio producers
        return Promise.all(localVideoProducers.map(localVideoProducer => {
            return stopProducer(connection, localVideoProducer.msProducer)
                .then(() => {
                    return new Promise((resolve, reject) => {
                        socket.emit(ClientDeviceEvents.REMOVE_VIDEO_PRODUCER, localVideoProducer.videoProducerId, (error?: string) => {
                            if (error) {
                                console.error(error)
                                reject(new Error(error));
                            }
                            resolve();
                        });
                        setTimeout(function () {
                            reject(new Error("Timed out: " + ClientDeviceEvents.REMOVE_VIDEO_PRODUCER));
                        }, TIMEOUT_MS);
                    })
                        .finally(() => setLocalVideoProducers(prevState => prevState.filter(p => p.videoProducerId !== localVideoProducer.videoProducerId)))
                })
        }))
            .finally(() => {
                console.log("[useMediasoup] Set working = false");
                setWorking(false)
            });
    }, [localVideoProducers]);

    useEffect(() => {
        if (!working && localDevice) {
            if (sendVideo !== localDevice.sendVideo) {
                console.log("Devices changed: sendVideo");
                if (localDevice.sendVideo) {
                    startStreamVideo();
                } else {
                    stopStreamingVideo();
                }
                setSendVideo(localDevice.sendVideo);
            }
            if (sendAudio !== localDevice.sendAudio) {
                console.log("Devices changed: sendAudio");
                if (localDevice.sendAudio) {
                    startStreamAudio();
                } else {
                    stopStreamingAudio();
                }
                setSendAudio(localDevice.sendAudio);
            }
            if (receiveVideo !== localDevice.receiveVideo) {
                console.log("Devices changed: receiveVideo");
                if (localDevice.receiveVideo) {
                    startConsumingVideo();
                } else {
                    stopConsumingVideo();
                }
                setReceiveVideo(localDevice.receiveVideo);
            }
            if (receiveAudio !== localDevice.receiveAudio) {
                console.log("[useMediasoup] Devices changed: receiveAudio");
                if (localDevice.receiveAudio) {
                    startConsumingAudio();
                } else {
                    stopConsumingAudio();
                }
                setReceiveAudio(localDevice.receiveAudio);
            }
        }

    }, [working, localDevice]);


    useEffect(() => {
        console.log("[useMediasoup] VIDEO PRODUCER CHANGED");
    }, [videoProducers]);

    useEffect(() => {
        console.log("[useMediasoup] AUDIO PRODUCER CHANGED");
    }, [audioProducers.allIds]);


    return (
        <MediasoupContext.Provider value={undefined}>
            {props.children}
        </MediasoupContext.Provider>
    )
};

export default MediasoupProvider;