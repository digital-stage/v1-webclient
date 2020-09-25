import {useCallback, useEffect, useState} from "react";
import {Device, Producer, Router} from "../common/model.common";
import {useDevices} from "../useDevices";
import {ClientDeviceEvents, ServerStageEvents} from "../common/events";
import mediasoupClient from 'mediasoup-client';
import {Device as MediasoupDevice} from 'mediasoup-client/lib/Device'
import {
    closeConsumer,
    createConsumer,
    createProducer,
    createWebRTCTransport,
    getFastestRouter,
    getUrl,
    RouterGetUrls,
    stopProducer
} from "./util";

export type RemoteProducer = Producer;

export interface MediasoupConsumer {
    remoteProducer: RemoteProducer;
    msConsumer: mediasoupClient.types.Consumer
}

export interface AudioConsumer extends MediasoupConsumer {
    actualVolume: number;
}

export type VideoConsumer = MediasoupConsumer;

export interface OvConsumer extends Producer {
}

export interface LocalProducer extends Producer {
    msProducer: mediasoupClient.types.Producer
}


const useMediasoup = () => {
    const {socket, localDevice} = useDevices();
    const [lastDevice, setLastDevice] = useState<Device>();
    const [router, setRouter] = useState<Router>();

    const [working, setWorking] = useState<boolean>(false);

    // For mediasoup
    const [device, setDevice] = useState<mediasoupClient.types.Device>();
    const [sendTransport, setSendTransport] = useState<mediasoupClient.types.Transport>();
    const [receiveTransport, setReceiveTransport] = useState<mediasoupClient.types.Transport>();

    // Remote offers
    const [remoteProducers, setRemoteProducers] = useState<RemoteProducer[]>([]);

    // Consumers
    const [audioConsumers, setAudioConsumers] = useState<AudioConsumer[]>([]);
    const [videoConsumers, setVideoConsumers] = useState<VideoConsumer[]>([]);
    const [ovConsumers, setOvConsumer] = useState<OvConsumer[]>([]);


    // Local producers
    const [localProducers, setLocalProducers] = useState<LocalProducer[]>([]);

    const [error, setError] = useState<string>();

    useEffect(() => {
        connect();
    }, []);

    const connect = useCallback(() => {
        getFastestRouter()
            .then(router => {
                setRouter(router);
                fetch(getUrl(router, RouterGetUrls.GetRTPCapabilities))
                    .then(result => result.json())
                    .then((rtpCapabilities: mediasoupClient.types.RtpCapabilities) => {
                        const handleDisconnect = () => {
                            console.error("Connected disconnected by server");
                        };
                        const device = new MediasoupDevice();
                        device.load({routerRtpCapabilities: rtpCapabilities})
                            .then(() => {
                                createWebRTCTransport(router, device, 'send', handleDisconnect)
                                    .then(transport => setSendTransport(transport));
                                createWebRTCTransport(router, device, 'receive', handleDisconnect)
                                    .then(transport => setReceiveTransport(transport));
                            })
                            .then(() => setDevice(device));
                    });
            })
            .catch(error => {
                console.error(error);
                setError(error);
            })
    }, [])


    const startSending = useCallback((kind: "audio" | "video") => {
        setWorking(true);
        navigator.mediaDevices.getUserMedia({
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
            .then(stream => kind === "audio" ? stream.getAudioTracks() : stream.getVideoTracks())
            .then(tracks =>
                Promise.all(tracks.map(track =>
                    createProducer(sendTransport, track)
                        .then(msProducer => {
                            return new Promise(resolve => {
                                socket.emit(ClientDeviceEvents.ADD_PRODUCER, {
                                    kind: kind,
                                    routerId: router._id
                                }, (producer: Producer) => {
                                    setLocalProducers(prevState => [...prevState, {
                                        ...producer,
                                        msProducer: msProducer
                                    }]);
                                    resolve();
                                });
                            });
                        })
                ))
            )
            .finally(() => setWorking(false));
    }, [localDevice, sendTransport]);

    const stopSending = useCallback((kind: "audio" | "video") => {
        setWorking(true);
        Promise.all(localProducers.filter(msProducer => msProducer.kind === kind)
            .map(producer => stopProducer(router, producer.msProducer)
                .then(() => new Promise(resolve => {
                    socket.emit(ClientDeviceEvents.REMOVE_PRODUCER, producer._id, () => {
                        setLocalProducers(prevState => prevState.filter(p => p._id !== producer._id));
                        resolve();
                    });
                }))
            ))
            .finally(() => setWorking(false));
    }, [localDevice, sendTransport, localProducers]);

    const addConsumer = useCallback((remoteProducer: RemoteProducer) => {
        if (router && device && receiveTransport) {
            createConsumer(router, device, receiveTransport, remoteProducer)
                .then(consumer => {
                    if (consumer.msConsumer.kind === "audio") {
                        const audioConsumer: AudioConsumer = {
                            ...consumer,
                            //TODO: Volume
                            actualVolume: 1
                        }
                        setAudioConsumers(prevState => [...prevState, audioConsumer]);
                    } else {
                        setVideoConsumers(prevState => [...prevState, consumer]);
                    }
                })
        } else {
            console.log("All null...");
        }
    }, [remoteProducers, router, device, receiveTransport]);

    const remoteConsumer = useCallback((consumer: MediasoupConsumer) => {
        closeConsumer(router, consumer)
            .then(() => {
                if (consumer.msConsumer.kind === "audio") {
                    setAudioConsumers(prevState => prevState.filter(c => c.remoteProducer._id === consumer.remoteProducer._id));
                } else {
                    setVideoConsumers(prevState => prevState.filter(c => c.remoteProducer._id === consumer.remoteProducer._id));
                }
            });
    }, [remoteProducers, router]);

    useEffect(() => {
        if (!working) {
            if (localDevice && sendTransport && receiveTransport) {
                if (!lastDevice || localDevice.sendVideo !== lastDevice.sendVideo) {
                    if (localDevice.sendVideo) {
                        startSending("video");
                    } else {
                        stopSending("video");
                    }
                }
                if (!lastDevice || localDevice.sendAudio !== lastDevice.sendAudio) {
                    if (localDevice.sendAudio) {
                        startSending("audio");
                    } else {
                        stopSending("audio");
                    }
                }
                if (!lastDevice || localDevice.receiveVideo !== lastDevice.receiveVideo) {
                    if (localDevice.receiveVideo) {
                        remoteProducers.filter(producer => producer.kind === "video").forEach(producer => addConsumer(producer));
                    } else {
                        videoConsumers.forEach(consumer => remoteConsumer(consumer));
                    }
                }
                if (!lastDevice || localDevice.receiveAudio !== lastDevice.receiveAudio) {
                    console.log("receive audio changed");
                }
                if (!lastDevice || localDevice.inputVideoDevice !== lastDevice.inputVideoDevice) {
                    if (localDevice.sendVideo) {
                        stopSending("video");
                        startSending("video");
                    }
                }
                if (!lastDevice || localDevice.inputAudioDevice !== lastDevice.inputAudioDevice) {
                    if (localDevice.sendAudio) {
                        stopSending("audio");
                        startSending("audio");
                    }
                }
            }
            setLastDevice(localDevice);
        }
    }, [localDevice, sendTransport, receiveTransport, working]);

    useEffect(() => {
        if (socket) {
            socket.on(ServerStageEvents.STAGE_PRODUCER_ADDED, (producer: Producer) => {
                setRemoteProducers(prevState => [...prevState, producer]);
            });
            socket.on(ServerStageEvents.STAGE_PRODUCER_CHANGED, (producer: Producer) => {
                setRemoteProducers(prevState => prevState.map(p => p._id === producer._id ? {...p, ...producer} : p));
            });
            socket.on(ServerStageEvents.STAGE_PRODUCER_REMOVED, (producerId: string) => {
                setRemoteProducers(prevState => prevState.filter(p => p._id !== producerId));
            });
            socket.on(ServerStageEvents.STAGE_JOINED, (payload: {
                producers: Producer[];
            }) => {
                // Remove all stage data (stage and groups exclusive)
                setRemoteProducers(prevState => [...prevState, ...payload.producers]);
            });
            socket.on(ServerStageEvents.STAGE_LEFT, (payload: {
                producers: Producer[];
            }) => {
                // Remove all stage data (stage and groups exclusive)
                setRemoteProducers([]);
            });
            socket.on("disconnect", () => {
                setRemoteProducers([]);
                setLocalProducers([]);
                setAudioConsumers([]);
                setVideoConsumers([]);
                setOvConsumer([]);
            })
        } else {
            setRemoteProducers([]);
            setLocalProducers([]);
            setAudioConsumers([]);
            setVideoConsumers([]);
            setOvConsumer([]);
        }
    }, [socket]);


    return {
        audioConsumers,
        videoConsumers,
        ovConsumers,
        localProducers,
        error
    }
}
export default useMediasoup;