import React, {useCallback, useEffect, useState} from "react";
import {
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
    RouterRequests, stopProducer
} from "./util";
import {Device as MediasoupDevice} from "mediasoup-client/lib/Device";
import {AdditionalReducerTypes} from "../useStageContext/normalizer";
import {useStageContext} from "../useStageContext";
import useStageSelector from "../useStageSelector";
import {ClientDeviceEvents, ServerDeviceEvents} from "../common/events";
import {AddAudioProducerPayload, RemoveAudioProducerPayload} from "../common/payloads";
import {GlobalAudioProducer} from "../../../../server/src/model.server";


const MediasoupContext = React.createContext(undefined);

export const MediasoupProvider = (props: {
    children: React.ReactNode
}) => {
    const {dispatch, socket} = useStageContext();
    const {localDevice, audioConsumers, videoConsumers, audioProducers, videoProducers, localAudioProducers, localVideoProducers} = useStageSelector(state => {
        return {
            localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined,
            audioConsumers: state.audioConsumers,
            videoProducers: state.videoProducers,
            videoConsumers: state.videoConsumers,
            audioProducers: state.audioProducers,
            localAudioProducers: state.localAudioProducers,
            localVideoProducers: state.localVideoProducers
        };
    });
    const [working, setWorking] = useState<boolean>(false);
    const [router, setRouter] = useState<Router>();
    const [connection, setConnection] = useState<SocketIOClient.Socket>();
    const [device, setDevice] = useState<mediasoupClient.types.Device>();
    const [sendTransport, setSendTransport] = useState<mediasoupClient.types.Transport>();
    const [receiveTransport, setReceiveTransport] = useState<mediasoupClient.types.Transport>();

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

    const [sendVideo, setSendVideo] = useState<boolean>(false);
    const [sendAudio, setSendAudio] = useState<boolean>(false);
    const [receiveVideo, setReceiveVideo] = useState<boolean>(false);
    const [receiveAudio, setReceiveAudio] = useState<boolean>(false);

    const streamAudio = useCallback(() => {
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
                                return new Promise(resolve => {
                                    socket.emit(ClientDeviceEvents.ADD_AUDIO_PRODUCER, {
                                        routerId: router._id,
                                        routerProducerId: producer.id
                                    } as AddAudioProducerPayload, (error: string | undefined, globalProducer: GlobalAudioProducer) => {
                                        if (error) {
                                            console.error(error);
                                            return stopProducer(socket, producer);
                                        }
                                        dispatch({
                                            type: AdditionalReducerTypes.ADD_LOCAL_AUDIO_PRODUCER,
                                            payload: {
                                                ...globalProducer,
                                                msProducer: producer
                                            }
                                        });
                                        resolve();
                                    });
                                });
                            })
                    }
                )))
            .finally(() => setWorking(false));
    }, [sendTransport, localDevice])

    const stopStreamingAudio = useCallback(() => {
        setWorking(true);
        // Assure, that we stop streaming all local audio producers
        return Promise.all(localAudioProducers.allIds.map(id => {
            if (localAudioProducers.byId[id]) {
                return stopProducer(connection, localAudioProducers.byId[id].msProducer)
                    .then(() => {
                        return new Promise(resolve => {
                            socket.emit(ClientDeviceEvents.REMOVE_AUDIO_PRODUCER, id, (error?: string) => {
                                if (error) {
                                    console.error(error);
                                }
                                dispatch({
                                    type: AdditionalReducerTypes.REMOVE_LOCAL_AUDIO_PRODUCER, payload: id
                                });
                                resolve();
                            });
                        })
                    });
            }
        }))
            .finally(() => setWorking(false));
    }, [localAudioProducers]);

    useEffect(() => {
        if (receiveAudio) {
            setWorking(true);
            // Assure, that we are consuming all audio producers
            Promise.all(audioProducers.allIds.map(id => {
                if (!audioProducers.byId[id].consumer) {
                    return createConsumer(connection, device, receiveTransport, audioProducers.byId[id])
                        .then(consumer => dispatch({
                            type: AdditionalReducerTypes.ADD_AUDIO_CONSUMER,
                            payload: {producerId: id, msConsumer: consumer}
                        }));
                }
            }))
                .finally(() => setWorking(false));
        } else {
            setWorking(true);
            // Assure, that we stop consuming all audio producers
            Promise.all(audioConsumers.allIds.map(id => {
                if (audioConsumers.byId[id]) {
                    return closeConsumer(connection, audioConsumers.byId[id].msConsumer)
                        .then(() => dispatch({
                            type: AdditionalReducerTypes.REMOVE_AUDIO_CONSUMER, payload: id
                        }));
                }
            }))
                .finally(() => setWorking(false));
        }
    }, [receiveAudio, audioProducers.allIds]);

    useEffect(() => {
        if (!working && localDevice) {
            if (sendVideo !== localDevice.sendVideo) {
                console.log("Devices changed: sendAudio");
                setSendVideo(localDevice.sendVideo);
            }
            if (sendAudio !== localDevice.sendAudio) {
                console.log("Devices changed: sendAudio");
                if (localDevice.sendAudio) {
                    streamAudio();
                } else {
                    stopStreamingAudio();
                }
                setSendAudio(localDevice.sendAudio);
            }
            if (receiveVideo !== localDevice.receiveVideo) {
                console.log("Devices changed: sendAudio");
                setReceiveVideo(localDevice.receiveVideo);
            }
            if (receiveAudio !== localDevice.receiveAudio) {
                console.log("Devices changed: sendAudio");
                setReceiveAudio(localDevice.receiveAudio);
            }
        }

    }, [working, localDevice]);

    return (
        <MediasoupContext.Provider value={undefined}>
            {props.children}
        </MediasoupContext.Provider>
    )
};

export default MediasoupProvider;