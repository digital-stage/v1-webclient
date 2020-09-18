import {Router} from "../common/model.common";
import mediasoupClient from 'mediasoup-client';
import {Device as MediasoupDevice} from 'mediasoup-client/lib/Device'

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
        .then(result => result.json());
};
export const fetchPost = <T>(url: string, body?: any): Promise<T> => {
    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body ? JSON.stringify(body) : undefined
    })
        .then(result => result.json());
};

export const getUrl = (router: Router, path?: string): string => {
    return "https://" + router.url + ":" + router.port + (path ? path : "");
}

export const getFastestRouter = (): Promise<Router> => {
    return Promise.resolve({
        _id: "123",
        url: "fra.routers.digital-stage.org",
        ipv4: "46.101.149.130",
        ipv6: "2a03:b0c0:3:d0::21:3001",
        port: 3020
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