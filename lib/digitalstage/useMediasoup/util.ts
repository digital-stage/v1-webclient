import mediasoupClient from 'mediasoup-client';
import {
  Router,
  StageMemberAudioProducer,
  StageMemberVideoProducer,
} from '../common/model.server';
import { TeckosClient } from '../../websocket';

export enum RouterEvents {
  TransportCloses = 'transport-closed',
  ProducerCreated = 'producer-created',
  ProducerPaused = 'producer-paused',
  ProducerResumed = 'producer-resumed',
  ProducerCloses = 'producer-closed',
  ConsumerCreated = 'consumer-created',
  ConsumerPaused = 'consumer-paused',
  ConsumerResumed = 'consumer-resumed',
  ConsumerCloses = 'consumer-closed',
}

export enum RouterRequests {
  GetRTPCapabilities = 'rtp-capabilities',
  CreateTransport = 'create-transport',
  ConnectTransport = 'connect-transport',
  CloseTransport = 'close-transport',
  CreateProducer = 'create-producer',
  PauseProducer = 'pause-producer',
  ResumeProducer = 'resume-producer',
  CloseProducer = 'close-producer',
  CreateConsumer = 'create-consumer',
  PauseConsumer = 'pause-consumer',
  ResumeConsumer = 'resume-consumer',
  CloseConsumer = 'close-consumer',
}

export const RouterGetUrls = {
  GetRTPCapabilities: '/rtp-capabilities',

  CreateTransport: '/transport/webrtc/create',

  CreatePlainTransport: '/transport/plain/create',
};

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
  CloseConsumer: '/consumer/close',
};

export const fetchGet = <T>(url: string): Promise<T> => fetch(url, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
}).then((result) => {
  if (result.ok) return result.json();
  throw new Error(result.statusText);
});

export const getUrl = (router: Router, path?: string): string => {
  const protocol: string = process.env.NEXT_PUBLIC_USE_SSL === 'true' ? 'https://' : 'http://';
  return `${protocol + router.url}:${router.port}${path || ''}`;
};

export const getFastestRouter = (): Promise<Router> => fetchGet<Router[]>(`${process.env.NEXT_PUBLIC_ROUTERS_URL}/routers`)
  .then((routers) => {
    if (routers && routers.length > 0) {
      return routers[0];
    }
    throw new Error('No routers available');
  })
  .catch(() => {
    throw new Error('Routingservice not available');
  });

export const createWebRTCTransport = (
  socket: TeckosClient,
  device: mediasoupClient.Device,
  direction: 'send' | 'receive',
): Promise<mediasoupClient.types.Transport> => new Promise<mediasoupClient.types.Transport>(
  (resolve, reject) => {
    socket.emit(
      RouterRequests.CreateTransport,
      {},
      (
        error: string,
        transportOptions: mediasoupClient.types.TransportOptions,
      ) => {
        if (error) {
          return reject(error);
        }
        const transport: mediasoupClient.types.Transport = direction === 'send'
          ? device.createSendTransport(transportOptions)
          : device.createRecvTransport(transportOptions);
        transport.on(
          'connect',
          async ({ dtlsParameters }, callback, errCallback) => {
            socket.emit(
              RouterRequests.ConnectTransport,
              {
                transportId: transport.id,
                dtlsParameters,
              },
              (transportError: string) => {
                if (transportError) return errCallback(error);
                return callback();
              },
            );
          },
        );
        if (direction === 'send') {
          transport.on('produce', async (producer, callback, errCallback) => {
            socket.emit(
              RouterRequests.CreateProducer,
              {
                transportId: transport.id,
                kind: producer.kind,
                rtpParameters: producer.rtpParameters,
                appData: producer.appData,
              },
              (produceError, payload) => {
                if (produceError) return errCallback(produceError);
                return callback({
                  ...producer,
                  id: payload.id,
                });
              },
            );
          });
        }
        return resolve(transport);
      },
    );
  },
);

export const createProducer = (
  transport: mediasoupClient.types.Transport,
  track: MediaStreamTrack,
): Promise<mediasoupClient.types.Producer> => transport.produce({
  // TODO: Fix this, TypeError: Cannot read property 'produce' of undefined
  track,
  appData: {
    trackId: track.id,
  },
});
export const pauseProducer = (
  socket: SocketIOClient.Socket,
  producer: mediasoupClient.types.Producer,
): Promise<mediasoupClient.types.Producer> => new Promise<mediasoupClient.types.Producer>(
  (resolve, reject) => socket
    .emit(RouterRequests.PauseProducer, producer.id, (error?: string) => {
      if (error) return reject(error);
      producer.pause();
      return resolve(producer);
    }),
);

export const resumeProducer = (
  socket: TeckosClient,
  producer: mediasoupClient.types.Producer,
): Promise<mediasoupClient.types.Producer> => new Promise<mediasoupClient.types.Producer>(
  (resolve, reject) => socket.emit(
    RouterRequests.ResumeProducer,
    producer.id,
    (error?: string) => {
      if (error) return reject(error);
      producer.resume();
      return resolve(producer);
    },
  ),
);

export const stopProducer = (
  socket: TeckosClient,
  producer: mediasoupClient.types.Producer,
): Promise<mediasoupClient.types.Producer> => new Promise<mediasoupClient.types.Producer>(
  (resolve, reject) => socket.emit(RouterRequests.CloseProducer, producer.id, (error?: string) => {
    producer.close();
    if (error) return reject(error);
    return resolve(producer);
  }),
);

export const createConsumer = (
  socket: TeckosClient,
  device: mediasoupClient.Device,
  transport: mediasoupClient.types.Transport,
  remoteProducer: StageMemberAudioProducer | StageMemberVideoProducer,
): Promise<mediasoupClient.types.Consumer> => new Promise<mediasoupClient.types.Consumer>(
  (resolve, reject) => {
    socket.emit(
      RouterRequests.CreateConsumer,
      {
        globalProducerId: remoteProducer.globalProducerId,
        transportId: transport.id,
        rtpCapabilities: device.rtpCapabilities, // TODO: Necessary?
      },
      (
        error: string | null,
        data?: {
          id: string;
          producerId: string;
          kind: 'audio' | 'video';
          rtpParameters: mediasoupClient.types.RtpParameters;
          paused: boolean;
          type: 'simple' | 'simulcast' | 'svc' | 'pipe';
        },
      ) => {
        if (error) {
          return reject(error);
        }
        return transport.consume(data).then((consumer) => {
          if (data.paused) consumer.pause();
          resolve(consumer);
        });
      },
    );
  },
);

export const resumeConsumer = (
  socket: TeckosClient,
  consumer: mediasoupClient.types.Consumer,
): Promise<mediasoupClient.types.Consumer> => {
  if (consumer.paused) {
    return new Promise<mediasoupClient.types.Consumer>((resolve, reject) => socket.emit(
      RouterRequests.ResumeConsumer,
      consumer.id,
      (error?: string) => {
        if (error) return reject(error);
        consumer.resume();
        return resolve(consumer);
      },
    ));
  }
  return null;
};

export const pauseConsumer = (
  socket: TeckosClient,
  consumer: mediasoupClient.types.Consumer,
): Promise<mediasoupClient.types.Consumer> => {
  if (!consumer.paused) {
    return new Promise<mediasoupClient.types.Consumer>((resolve, reject) => socket.emit(
      RouterRequests.PauseConsumer,
      consumer.id,
      (error?: string) => {
        if (error) return reject(error);
        consumer.pause();
        return resolve(consumer);
      },
    ));
  }
  return null;
};

export const closeConsumer = (
  socket: TeckosClient,
  consumer: mediasoupClient.types.Consumer,
): Promise<mediasoupClient.types.Consumer> => new Promise<mediasoupClient.types.Consumer>(
  (resolve, reject) => socket.emit(
    RouterRequests.CloseConsumer,
    consumer.id,
    (error?: string) => {
      if (error) return reject(error);
      consumer.close();
      return resolve(consumer);
    },
  ),
);
