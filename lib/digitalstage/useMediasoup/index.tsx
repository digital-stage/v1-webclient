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
import {useSocket} from "../useStageContext";
import {AudioProducer, Device, VideoProducer} from "../useStageContext/model";
import {useDispatch, useSelector} from "../useStageContext/redux";
import allActions from "../useStageContext/redux/actions";
import {
    AudioConsumers,
    AudioProducers,
    NormalizedState,
    VideoConsumers,
    VideoProducers
} from "../useStageContext/schema";
import useStageSelector from "../useStageSelector";

const TIMEOUT_MS: number = 4000;

const MediasoupContext = React.createContext(undefined);

enum TaskAction {
    CONSUME_VIDEO = "consume-video",
    CONSUME_AUDIO = "consume-audio",
    STOP_CONSUMING_VIDEO = "stop-consuming-video",
    STOP_CONSUMING_AUDIO = "stop-consuming-audio",
}

interface Task {
    action: TaskAction,
    payload: string
}

export const MediasoupProvider = (props: {
    children: React.ReactNode
}) => {
    const socket = useSocket();
    const dispatch = useDispatch();

    const localDevice = useSelector<NormalizedState, Device>(state => {
        if (state.devices.local)
            return state.devices.byId[state.devices.local];
        return undefined;
    });
    const audioConsumers = useStageSelector<AudioConsumers>(state => state.audioConsumers);
    const videoConsumers = useStageSelector<VideoConsumers>(state => state.videoConsumers);
    const videoProducers = useStageSelector<VideoProducers>(state => state.videoProducers);
    const audioProducers = useStageSelector<AudioProducers>(state => state.audioProducers);

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

    const consumeVideoProducer = useCallback((producerId: string) => {
        const producer = videoProducers.byId[producerId];
        if (producer) {
            return createConsumer(connection, device, receiveTransport, producer)
                .then(consumer => {
                    if (consumer.paused)
                        return resumeConsumer(connection, consumer);
                    return consumer;
                })
                .then(consumer => {
                        return dispatch(allActions.stageActions.client.addVideoConsumer({
                            _id: consumer.id,
                            stage: producer.stageId,
                            stageMember: producer.stageMemberId,
                            videoProducer: producer._id,
                            msConsumer: consumer
                        }))
                    }
                );
        } else {
            throw new Error("Could not find producer=" + producerId);
        }
    }, [connection, device, receiveTransport, videoProducers, videoConsumers]);

    const stopConsumingVideoProducer = useCallback((producerId: string) => {
        const consumerId = videoConsumers.byProducer[producerId];
        if (consumerId && videoConsumers.byId[consumerId]) {
            return closeConsumer(connection, videoConsumers.byId[consumerId].msConsumer)
                .then(() => dispatch(allActions.stageActions.client.removeVideoConsumer(consumerId)))
        } else {
            //throw new Error("Could not find consumer for producer " + producerId);
        }
    }, [connection, videoConsumers]);

    const consumeAudioProducer = useCallback((producerId: string) => {
        const producer = audioProducers.byId[producerId];
        if (producer) {
            return createConsumer(connection, device, receiveTransport, producer)
                .then(consumer => {
                    if (consumer.paused)
                        return resumeConsumer(connection, consumer);
                    return consumer;
                })
                .then(consumer => {
                        return dispatch(allActions.stageActions.client.addAudioConsumer({
                            _id: consumer.id,
                            stage: producer.stageId,
                            stageMember: producer.stageMemberId,
                            audioProducer: producer._id,
                            msConsumer: consumer
                        }))
                    }
                );
        } else {
            throw new Error("Could not find producer=" + producerId);
        }
    }, [connection, device, receiveTransport, audioProducers, audioConsumers]);

    const stopConsumingAudioProducer = useCallback((producerId: string) => {
        const consumerId = audioConsumers.byProducer[producerId];
        if (consumerId && audioConsumers.byId[consumerId]) {
            return closeConsumer(connection, audioConsumers.byId[consumerId].msConsumer)
                .then(() => dispatch(allActions.stageActions.client.removeAudioConsumer(consumerId)))
        } else {
            throw new Error("Could not find consumer for producer " + producerId);
        }
    }, [connection, audioConsumers]);

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
                setReceiveVideo(localDevice.receiveVideo);
            }
            if (receiveAudio !== localDevice.receiveAudio) {
                setReceiveAudio(localDevice.receiveAudio);
            }
        }

    }, [working, localDevice]);

    const [handledVideoProducerIds, setHandledVideoProducerIds] = useState<string[]>([]);
    const [consumingVideoProducerIds, setConsumingVideoProducerIds] = useState<string[]>([]);
    const [handledAudioProducerIds, setHandledAudioProducerIds] = useState<string[]>([]);
    const [consumingAudioProducerIds, setConsumingAudioProducerIds] = useState<string[]>([]);

    const syncVideoProducers = useCallback(() => {
        setConsumingVideoProducerIds(prev => {
            const addedVideoProducerIds = handledVideoProducerIds.filter(id => prev.indexOf(id) === -1);
            const existingVideoProducerIds = handledVideoProducerIds.filter(id => prev.indexOf(id) !== -1);
            const removedVideoProducerIds = prev.filter(id => handledVideoProducerIds.indexOf(id) === -1);

            addedVideoProducerIds.map(producerId => consumeVideoProducer(producerId));
            removedVideoProducerIds.map(producerId => stopConsumingVideoProducer(producerId));

            return [...existingVideoProducerIds, ...addedVideoProducerIds];
        })
    }, [handledVideoProducerIds, consumingVideoProducerIds]);

    const syncAudioProducers = useCallback(() => {
        setConsumingAudioProducerIds(prev => {
            const addedAudioProducerIds = handledAudioProducerIds.filter(id => prev.indexOf(id) === -1);
            const existingAudioProducerIds = handledAudioProducerIds.filter(id => prev.indexOf(id) !== -1);
            const removedAudioProducerIds = prev.filter(id => handledAudioProducerIds.indexOf(id) === -1);

            addedAudioProducerIds.map(producerId => consumeAudioProducer(producerId));
            removedAudioProducerIds.map(producerId => stopConsumingAudioProducer(producerId));

            return [...existingAudioProducerIds, ...addedAudioProducerIds];
        })
    }, [handledAudioProducerIds, consumingAudioProducerIds]);

    useEffect(() => {
        syncVideoProducers();
    }, [handledVideoProducerIds])

    useEffect(() => {
        syncAudioProducers();
    }, [handledAudioProducerIds])

    useEffect(() => {
        if (receiveVideo) {
            console.log("[useMediasoup] START CONSUMING VIDEO");
            setHandledVideoProducerIds(videoProducers.allIds);
        } else {
            console.log("[useMediasoup] STOP CONSUMING VIDEO");
            setHandledVideoProducerIds([]);
        }
    }, [receiveVideo, videoProducers]);

    useEffect(() => {
        if (receiveAudio) {
            console.log("[useMediasoup] START CONSUMING AUDIO");
            setHandledAudioProducerIds(audioProducers.allIds);
        } else {
            console.log("[useMediasoup] STOP CONSUMING AUDIO");
            setHandledAudioProducerIds([]);
        }
    }, [receiveAudio, audioProducers]);


    return (
        <MediasoupContext.Provider value={undefined}>
            {props.children}
        </MediasoupContext.Provider>
    )
};

export default MediasoupProvider;