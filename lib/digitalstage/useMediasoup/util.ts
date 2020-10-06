import {Router} from "../common/model.common";
import mediasoupClient from 'mediasoup-client';
import {ROUTERS_URL} from "../../../env";
import Client from "../common/model.client";

export enum RouterEvents {
    TransportCloses = "transport-closed",
    ProducerCreated = "producer-created",
    ProducerPaused = "producer-paused",
    ProducerResumed = "producer-resumed",
    ProducerCloses = "producer-closed",
    ConsumerCreated = "consumer-created",
    ConsumerPaused = "consumer-paused",
    ConsumerResumed = "consumer-resumed",
    ConsumerCloses = "consumer-closed",
}

export enum RouterRequests {
    GetRTPCapabilities = "rtp-capabilities",
    CreateTransport = "create-transport",
    ConnectTransport = "connect-transport",
    CloseTransport = "close-transport",
    CreateProducer = "create-producer",
    PauseProducer = "pause-producer",
    ResumeProducer = "resume-producer",
    CloseProducer = "close-producer",
    CreateConsumer = "create-consumer",
    PauseConsumer = "pause-consumer",
    ResumeConsumer = "resume-consumer",
    CloseConsumer = "close-consumer",
}

export const RouterGetUrls = {
    GetRTPCapabilities: '/rtp-capabilities',

    CreateTransport: '/transport/webrtc/create',

    CreatePlainTransport: '/transport/plain/create'
}

export const RouterPostUrls = {
    ConnectTransport: '/transport/webrtc/connect',
    CloseTransport: '/transport/webrtc/close',

    ConnectPlainTransport: '/transport/plain/connect',
    ClosePlainTransport: '/transport/plain/close',

    // Auth required:
    CreateProducer: '/producer/create',
    PauseProducer: '/producer/pause',
    ResumeProducer: '/producer/resume',
    CloseProducer: '/producer/close',

    // Auth required:
    CreateConsumer: '/consumer/create',
    PauseConsumer: '/consumer/pause',
    ResumeConsumer: '/consumer/resume',
    CloseConsumer: '/consumer/close'
}

export const fetchGet = <T>(url: string): Promise<T> => {
    return fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(result => {
            if (result.ok)
                return result.json();
            throw new Error(result.statusText);
        })
};

export const getUrl = (router: Router, path?: string): string => {
    return "https://" + router.url + ":" + router.port + (path ? path : "");
}

export const getFastestRouter = (): Promise<Router> => {
    return fetchGet<Router[]>(ROUTERS_URL + "/routers")
        .then(routers => {
            if (routers && routers.length > 0) {
                return routers[0];
            } else
                throw new Error("No routers available");
        });
};


export const createWebRTCTransport = (socket: SocketIOClient.Socket, device: mediasoupClient.Device, direction: "send" | "receive"): Promise<mediasoupClient.types.Transport> => {
    console.log("createWebRTCTransport");
    return new Promise<mediasoupClient.types.Transport>((resolve) => {
        socket.emit(RouterRequests.CreateTransport, {}, (error: string, transportOptions: mediasoupClient.types.TransportOptions) => {
            if (error) {
                return console.error(error);
            }
            const transport: mediasoupClient.types.Transport =
                direction === 'send'
                    ? device.createSendTransport(transportOptions)
                    : device.createRecvTransport(transportOptions);
            transport.on(
                'connect',
                async ({dtlsParameters}, callback, errCallback) => {
                    socket.emit(RouterRequests.ConnectTransport, {
                        transportId: transport.id,
                        dtlsParameters: dtlsParameters
                    }, (error: string) => {
                        if (error)
                            return errCallback(error);
                        return callback();
                    })
                }
            )
            if (direction === 'send') {
                transport.on('produce', async (producer, callback, errCallback) => {
                    socket.emit(RouterRequests.CreateProducer, {
                        transportId: transport.id,
                        kind: producer.kind,
                        rtpParameters: producer.rtpParameters,
                        appData: producer.appData
                    }, (error, payload) => {
                        if (error)
                            return errCallback(error);
                        producer.id = payload.id
                        return callback(producer)
                    });
                })
            }
            resolve(transport);
        })
    })
};

export const createProducer = (transport: mediasoupClient.types.Transport, track: MediaStreamTrack): Promise<mediasoupClient.types.Producer> => {
    return transport
        .produce({
            track: track,
            appData: {
                trackId: track.id
            }
        })
}

export const pauseProducer = (socket: SocketIOClient.Socket, producer: mediasoupClient.types.Producer): Promise<mediasoupClient.types.Producer> =>
    new Promise<mediasoupClient.types.Producer>((resolve, reject) =>
        socket.emit(RouterRequests.PauseProducer, producer.id, (error?: string) => {
            if (error)
                return reject(error);
            producer.pause();
            return resolve(producer);
        })
    );


export const resumeProducer = (socket: SocketIOClient.Socket, producer: mediasoupClient.types.Producer): Promise<mediasoupClient.types.Producer> =>
    new Promise<mediasoupClient.types.Producer>((resolve, reject) =>
        socket.emit(RouterRequests.ResumeProducer, producer.id, (error?: string) => {
            if (error)
                return reject(error);
            producer.resume();
            return resolve(producer);
        })
    );

export const stopProducer = (socket: SocketIOClient.Socket, producer: mediasoupClient.types.Producer): Promise<mediasoupClient.types.Producer> =>
    new Promise<mediasoupClient.types.Producer>((resolve, reject) =>
        socket.emit(RouterRequests.CloseProducer, producer.id, (error?: string) => {
            if (error)
                return reject(error);
            producer.close();
            return resolve(producer);
        })
    );

export const createConsumer = (socket: SocketIOClient.Socket, device: mediasoupClient.Device, transport: mediasoupClient.types.Transport, remoteProducer: Client.RemoteAudioProducer | Client.RemoteVideoProducer): Promise<mediasoupClient.types.Consumer> =>
    new Promise<mediasoupClient.types.Consumer>((resolve, reject) => {
        socket.emit(RouterRequests.CreateConsumer, {
            globalProducerId: remoteProducer.globalProducerId,
            transportId: transport.id,
            rtpCapabilities: device.rtpCapabilities // TODO: Necessary?
        }, (error: string | null, data?: {
            id: string
            producerId: string
            kind: 'audio' | 'video'
            rtpParameters: mediasoupClient.types.RtpParameters
            paused: boolean
            type: 'simple' | 'simulcast' | 'svc' | 'pipe'
        }) => {
            if (error) {
                return reject(error);
            }
            return transport.consume(data)
                .then(consumer => {
                    if (data.paused)
                        consumer.pause();
                    resolve(consumer);
                })
        });
    });

export const resumeConsumer = (socket: SocketIOClient.Socket, consumer: mediasoupClient.types.Consumer): Promise<mediasoupClient.types.Consumer> => {
    if (consumer.paused) {
        return new Promise<mediasoupClient.types.Consumer>((resolve, reject) =>
            socket.emit(RouterRequests.ResumeConsumer, consumer.id, (error?: string) => {
                if (error)
                    return reject(error);
                consumer.resume();
                return resolve(consumer);
            })
        );
    }
}

export const pauseConsumer = (socket: SocketIOClient.Socket, consumer: mediasoupClient.types.Consumer): Promise<mediasoupClient.types.Consumer> => {
    if (!consumer.paused) {
        return new Promise<mediasoupClient.types.Consumer>((resolve, reject) =>
            socket.emit(RouterRequests.PauseConsumer, consumer.id, (error?: string) => {
                if (error)
                    return reject(error);
                consumer.pause();
                return resolve(consumer);
            })
        );
    }
}

export const closeConsumer = (socket: SocketIOClient.Socket, consumer: mediasoupClient.types.Consumer): Promise<mediasoupClient.types.Consumer> => {
    console.log("closeConsumer");
    return new Promise<mediasoupClient.types.Consumer>((resolve, reject) =>
        socket.emit(RouterRequests.CloseConsumer, consumer.id, (error?: string) => {
            if (error)
                return reject(error);
            consumer.close();
            return resolve(consumer);
        })
    );
}