import {Router} from "../common/model.common";
import mediasoupClient from 'mediasoup-client';
import {Device as MediasoupDevice} from 'mediasoup-client/lib/Device'
import {ROUTERS_URL} from "../../../env";
import Client from "../common/model.client";

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

const prefix = process.env.NODE_ENV === "production" ? "https://" : "http://";

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
export const fetchPost = <T>(url: string, body?: any): Promise<T> => {
    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body ? JSON.stringify(body) : undefined
    })
        .then(result => {
            if (result.ok)
                return result.json();
            throw new Error(result.statusText);
        })
};


export const getUrl = (router: Router, path?: string): string => {
    return prefix + router.url + ":" + router.port + (path ? path : "");
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

export const createWebRTCTransport = (
    router: Router,
    device: MediasoupDevice,
    type: 'send' | 'receive',
    handleClose?: () => void
): Promise<mediasoupClient.types.Transport> => {
    return fetchGet<mediasoupClient.types.TransportOptions>(getUrl(router, RouterGetUrls.CreateTransport))
        .then(transportOptions => {
                const transport: mediasoupClient.types.Transport =
                    type === 'send'
                        ? device.createSendTransport(transportOptions)
                        : device.createRecvTransport(transportOptions)
                transport.on(
                    'connect',
                    async ({dtlsParameters}, callback, errCallback) => {
                        return fetchPost(getUrl(router, RouterPostUrls.ConnectTransport), {
                            transportId: transport.id,
                            dtlsParameters: dtlsParameters
                        })
                            .then(() => callback())
                            .catch((error) => errCallback(error))
                    }
                )
                if (handleClose)
                    transport.on('connectionstatechange', async (state) => {
                        if (
                            state === 'closed' ||
                            state === 'failed' ||
                            state === 'disconnected'
                        ) handleClose()
                    });
                if (type === 'send') {
                    transport.on('produce', async (producer, callback, errCallback) => {
                        return fetchPost<{ id: string }>(getUrl(router, RouterPostUrls.CreateProducer), {
                            transportId: transport.id,
                            kind: producer.kind,
                            rtpParameters: producer.rtpParameters,
                            appData: producer.appData
                        })
                            .then(payload => {
                                producer.id = payload.id
                                return callback(producer)
                            })
                            .catch((error) => errCallback(error))
                    })
                }
                return transport
            }
        )
}

export const createProducer = (transport: mediasoupClient.types.Transport, track: MediaStreamTrack): Promise<mediasoupClient.types.Producer> => {
    return transport
        .produce({
            track: track,
            appData: {
                trackId: track.id
            }
        })
}

export const pauseProducer = (router: Router, producer: mediasoupClient.types.Producer): Promise<mediasoupClient.types.Producer> =>
    fetchPost(getUrl(router, RouterPostUrls.PauseProducer), {
        id: producer.id
    })
        .then(() => {
            producer.pause();
            return producer;
        });


export const resumeProducer = (router: Router, producer: mediasoupClient.types.Producer): Promise<mediasoupClient.types.Producer> =>
    fetchPost(getUrl(router, RouterPostUrls.ResumeProducer), {
        id: producer.id
    })
        .then(() => {
            producer.resume();
            return producer;
        });

export const stopProducer = (router: Router, producer: mediasoupClient.types.Producer): Promise<mediasoupClient.types.Producer> =>
    fetchPost(getUrl(router, RouterPostUrls.CloseProducer), {
        id: producer.id
    })
        .then(() => {
            producer.close();
            return producer;
        });

export const createConsumer = (router: Router, device: mediasoupClient.types.Device, transport: mediasoupClient.types.Transport, remoteProducer: Client.RemoteProducer): Promise<mediasoupClient.types.Consumer> => {
    console.log("createConsumer");
    return fetchPost(getUrl(router, RouterPostUrls.CreateConsumer), {
        globalProducerId: remoteProducer._id,
        transportId: transport.id,
        rtpCapabilities: device.rtpCapabilities // TODO: Necessary?
    })
        .then(
            async (data: {
                id: string
                producerId: string
                kind: 'audio' | 'video'
                rtpParameters: mediasoupClient.types.RtpParameters
                paused: boolean
                type: 'simple' | 'simulcast' | 'svc' | 'pipe'
            }) => {
                const consumer = await transport.consume(data);
                if (data.paused) consumer.pause();
                return consumer
            }
        )
        .catch(error => {
            console.error(error);
            throw error;
        })
}

export const resumeConsumer = (router: Router, consumer: mediasoupClient.types.Consumer): Promise<mediasoupClient.types.Consumer> => {
    if (consumer.paused) {
        return fetchPost(getUrl(router, RouterPostUrls.ResumeConsumer), {
            id: consumer.id
        })
            .then(() => {
                consumer.resume();
                return consumer;
            })
    }
}

export const pauseConsumer = (router: Router, consumer: mediasoupClient.types.Consumer): Promise<mediasoupClient.types.Consumer> => {
    if (!consumer.paused) {
        return fetchPost(getUrl(router, RouterPostUrls.PauseConsumer), {
            id: consumer.id
        })
            .then(() => {
                consumer.pause();
                return consumer;
            })
    }
}

export const closeConsumer = (router: Router, consumer: mediasoupClient.types.Consumer): Promise<mediasoupClient.types.Consumer> => {
    console.log("closeConsumer");
    return fetchPost(getUrl(router, RouterPostUrls.CloseConsumer), {
        id: consumer.id
    })
        .then(() => {
            consumer.close();
            return consumer;
        });
}