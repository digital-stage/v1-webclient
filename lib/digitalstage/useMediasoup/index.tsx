import {useCallback, useEffect, useState} from "react";
import {Device, Producer, Router} from "../common/model.common";
import {useDevices} from "../useDevices";
import {ServerStageEvents} from "../common/events";
import mediasoupClient from 'mediasoup-client';
import {Device as MediasoupDevice} from 'mediasoup-client/lib/Device'
import {createProducer, createWebRTCTransport, getFastestRouter, getUrl, RouterGetUrls, stopProducer} from "./util";

export interface Consumer {

}

export interface ResolvedProducer extends Producer {
    actualVolume: number;
}

export interface OVProducer extends Producer {

}

export interface AudioProducer extends ResolvedProducer {

}

export interface VideoProducer extends ResolvedProducer {

}

const createConsumer = (producer: Producer) => {

};


const useMediasoup = () => {
    const {socket, localDevice} = useDevices();
    const [lastDevice, setLastDevice] = useState<Device>();
    const [audioProducers, setAudioProducers] = useState<AudioProducer[]>([]);
    const [videoProducers, setVideoProducers] = useState<VideoProducer[]>([]);
    const [ovProducers, setOvProducers] = useState<OVProducer[]>([]);
    const [device, setDevice] = useState<MediasoupDevice>();
    const [router, setRouter] = useState<Router>();
    const [sendTransport, setSendTransport] = useState<mediasoupClient.types.Transport>();
    const [receiveTransport, setReceiveTransport] = useState<mediasoupClient.types.Transport>();
    const [producers, setProducers] = useState<mediasoupClient.types.Producer[]>([]);
    const [volumes, setVolumes] = useState<{
        userId: string;
        volume: number
    }[]>([]);

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
                            .then(() => setDevice(device))
                            .then(() => {
                                createWebRTCTransport(router, device, 'send', handleDisconnect)
                                    .then(transport => setSendTransport(transport));
                                createWebRTCTransport(router, device, 'receive', handleDisconnect)
                                    .then(transport => setReceiveTransport(transport));
                            })
                    });
            });
    }, []);

    const disconnect = useCallback(() => {
    }, [device]);

    const sendVideo = useCallback(() => {
        navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: localDevice.inputVideoDevice
            }
        })
            .then(stream => {
                stream.getVideoTracks().forEach(track => {
                    createProducer(sendTransport, track)
                        .then(producer => {
                            setProducers(prevState => [...prevState, producer]);
                        });
                })

            });
    }, [localDevice, sendTransport]);

    const stopSendingVideo = useCallback(() => {
        producers.forEach(producer => {
            if (producer.kind === "video") {
                stopProducer(router, producer)
                    .then(() => {
                        setProducers(prevState => prevState.filter(p => p.id === producer.id));
                    })
            }
        })

    }, [localDevice, sendTransport]);

    const sendAudio = useCallback(() => {
        navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: localDevice.inputAudioDevice,
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: false
            }
        })
            .then(stream => {
                stream.getAudioTracks().forEach(track => {
                    createProducer(sendTransport, track)
                        .then(producer => {
                            setProducers(prevState => [...prevState, producer]);
                        });
                })

            });
    }, [localDevice, sendTransport]);

    const stopSendingAudio = useCallback(() => {
        producers.forEach(producer => {
            if (producer.kind === "audio") {
                stopProducer(router, producer)
                    .then(() => {
                        setProducers(prevState => prevState.filter(p => p.id === producer.id));
                    })
            }
        })

    }, [localDevice, sendTransport]);

    useEffect(() => {
        console.log("Producers changed");
        console.log(producers);
    }, [producers]);

    useEffect(() => {
        if (localDevice && sendTransport && receiveTransport) {
            if (!lastDevice || localDevice.sendVideo !== lastDevice.sendVideo) {
                if (localDevice.sendVideo) {
                    sendVideo();
                } else {
                    stopSendingVideo();
                }
            }
            if (!lastDevice || localDevice.sendAudio !== lastDevice.sendAudio) {
                if (localDevice.sendAudio) {
                    sendAudio();
                } else {
                    stopSendingAudio();
                }
            }
            if (!lastDevice || localDevice.receiveVideo !== lastDevice.receiveVideo) {
                console.log("receive video changed");
            }
            if (!lastDevice || localDevice.receiveAudio !== lastDevice.receiveAudio) {
                console.log("receive audio changed");
            }
            if (!lastDevice || localDevice.inputVideoDevice !== lastDevice.inputVideoDevice) {
                stopSendingVideo();
                sendVideo();
            }
            if (!lastDevice || localDevice.inputAudioDevice !== lastDevice.inputAudioDevice) {
                stopSendingAudio();
                sendAudio();
            }
        }
        setLastDevice(localDevice);
    }, [localDevice, sendTransport, receiveTransport]);

    useEffect(() => {
        if (socket) {
            socket.on(ServerStageEvents.GROUP_ADDED, (producer: Producer) => {
            });
            socket.on(ServerStageEvents.GROUP_CHANGED, (producer: Producer) => {
            });
            socket.on(ServerStageEvents.GROUP_REMOVED, (producer: Producer) => {
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_ADDED, (producer: Producer) => {
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_CHANGED, (producer: Producer) => {
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_REMOVED, (producer: Producer) => {
            });
            socket.on(ServerStageEvents.PRODUCER_ADDED, (producer: Producer) => {
            });
            socket.on(ServerStageEvents.PRODUCER_CHANGED, (producer: Producer) => {
            });
            socket.on(ServerStageEvents.PRODUCER_REMOVED, (producerId: string) => {
            });
            socket.on("disconnect", () => {
                setAudioProducers([]);
                setVideoProducers([]);
                setOvProducers([]);
            })
        } else {
            setAudioProducers([]);
            setVideoProducers([]);
            setOvProducers([]);
        }
    }, [socket]);


    return {
        audioProducers,
        videoProducers,
        ovProducers
    }
}
export default useMediasoup;