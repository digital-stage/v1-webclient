import mediasoupClient from 'mediasoup-client';
import { ITeckosClient } from 'teckos-client';
import debug from 'debug';
import { Router } from '../../types';

const reportError = debug('useMediasoup:err');

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

export const fetchGet = <T>(url: string): Promise<T> =>
  fetch(url, {}).then((result) => {
    if (result.ok) return result.json();
    throw new Error(result.statusText);
  });

export const getFastestRouter = (routerDistUrl: string): Promise<Router> =>
  fetchGet<Router[]>(`${routerDistUrl}/routers`)
    .then(async (routers) => {
      if (routers.length === 0) {
        throw new Error('No router available');
      }
      // First get latencies for all routers
      const routerWithLatencies: {
        router: Router;
        latency: number;
      }[] = await Promise.all(
        routers.map(async (router) => {
          const url = `${router.restPrefix}://${router.url}:${router.port}${
            router.path ? `/${router.path}/` : ''
          }/ping`;
          try {
            const latency = await ping(url);
            return {
              router,
              latency,
            };
          } catch (error) {
            reportError(error);
            return {
              router,
              latency: 9999,
            };
          }
        })
      );
      const fastestRouterWithLatency = routerWithLatencies.reduce((prev, curr) => {
        if (prev.latency > curr.latency) {
          return curr;
        }
        return prev;
      });
      return fastestRouterWithLatency.router;
    })
    .catch(() => {
      throw new Error('Routingservice not available');
    });

function requestImage(url: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(url);
    };
    img.src = `${url}?random-no-cache=${Math.floor((1 + Math.random()) * 0x10000).toString(16)}`;
  });
}

function ping(url: string, multiplier?: number): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const start: number = new Date().getTime();
    const response = () => {
      let delta: number = new Date().getTime() - start;
      delta *= multiplier || 1;
      resolve(delta);
    };
    requestImage(url)
      .then(response)
      .catch(() => reject(Error('Error')));

    // Set a timeout for max-pings, 300ms.
    setTimeout(() => {
      reject(Error('Timeout'));
    }, 300);
  });
}

export const createWebRTCTransport = (
  socket: ITeckosClient,
  device: mediasoupClient.Device,
  direction: 'send' | 'receive'
): Promise<mediasoupClient.types.Transport> =>
  new Promise<mediasoupClient.types.Transport>((resolve, reject) => {
    socket.emit(
      RouterRequests.CreateTransport,
      {},
      (error: string, transportOptions: mediasoupClient.types.TransportOptions) => {
        if (error) {
          return reject(error);
        }
        const transport: mediasoupClient.types.Transport =
          direction === 'send'
            ? device.createSendTransport(transportOptions)
            : device.createRecvTransport(transportOptions);
        transport.on('connect', async ({ dtlsParameters }, callback, errCallback) => {
          socket.emit(
            RouterRequests.ConnectTransport,
            {
              transportId: transport.id,
              dtlsParameters,
            },
            (transportError: string) => {
              if (transportError) return errCallback(error);
              return callback();
            }
          );
        });
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
              (produceError: string | undefined, payload: any) => {
                if (produceError) return errCallback(produceError);
                return callback({
                  ...producer,
                  id: payload.id,
                });
              }
            );
          });
        }
        return resolve(transport);
      }
    );
  });

export const createProducer = (
  transport: mediasoupClient.types.Transport,
  track: MediaStreamTrack
): Promise<mediasoupClient.types.Producer> =>
  transport.produce({
    track,
    appData: {
      trackId: track.id,
    },
  });
export const pauseProducer = (
  socket: ITeckosClient,
  producer: mediasoupClient.types.Producer
): Promise<mediasoupClient.types.Producer> =>
  new Promise<mediasoupClient.types.Producer>((resolve, reject) =>
    socket.emit(RouterRequests.PauseProducer, producer.id, (error?: string) => {
      if (error) return reject(error);
      producer.pause();
      return resolve(producer);
    })
  );

export const resumeProducer = (
  socket: ITeckosClient,
  producer: mediasoupClient.types.Producer
): Promise<mediasoupClient.types.Producer> =>
  new Promise<mediasoupClient.types.Producer>((resolve, reject) =>
    socket.emit(RouterRequests.ResumeProducer, producer.id, (error?: string) => {
      if (error) return reject(error);
      producer.resume();
      return resolve(producer);
    })
  );

export const stopProducer = (
  socket: ITeckosClient,
  producer: mediasoupClient.types.Producer
): Promise<mediasoupClient.types.Producer> =>
  new Promise<mediasoupClient.types.Producer>((resolve, reject) =>
    socket.emit(RouterRequests.CloseProducer, producer.id, (error?: string) => {
      producer.close();
      if (error) return reject(error);
      return resolve(producer);
    })
  );

export const createConsumer = (
  socket: ITeckosClient,
  device: mediasoupClient.Device,
  transport: mediasoupClient.types.Transport,
  globalProducerId: string
): Promise<mediasoupClient.types.Consumer> =>
  new Promise<mediasoupClient.types.Consumer>((resolve, reject) => {
    socket.emit(
      RouterRequests.CreateConsumer,
      {
        globalProducerId,
        transportId: transport.id,
        rtpCapabilities: device.rtpCapabilities, // TODO: Necessary?
      },
      async (
        error: string | null,
        data: {
          id: string;
          producerId: string;
          kind: 'audio' | 'video';
          rtpParameters: mediasoupClient.types.RtpParameters;
          paused: boolean;
          type: 'simple' | 'simulcast' | 'svc' | 'pipe';
        }
      ) => {
        if (error) {
          return reject(error);
        }
        try {
          const consumer = await transport.consume(data);
          if (data.paused) {
            consumer.pause();
          }
          return resolve(consumer);
        } catch (consumingError) {
          return reject(consumingError);
        }
      }
    );
  });

export const resumeConsumer = (
  socket: ITeckosClient,
  consumer: mediasoupClient.types.Consumer
): Promise<mediasoupClient.types.Consumer> => {
  if (consumer.paused) {
    return new Promise<mediasoupClient.types.Consumer>((resolve, reject) =>
      socket.emit(RouterRequests.ResumeConsumer, consumer.id, (error?: string) => {
        if (error) return reject(error);
        consumer.resume();
        return resolve(consumer);
      })
    );
  }
  return Promise.reject(new Error('Consumer is paused yet'));
};

export const pauseConsumer = (
  socket: ITeckosClient,
  consumer: mediasoupClient.types.Consumer
): Promise<mediasoupClient.types.Consumer> => {
  if (!consumer.paused) {
    return new Promise<mediasoupClient.types.Consumer>((resolve, reject) =>
      socket.emit(RouterRequests.PauseConsumer, consumer.id, (error?: string) => {
        if (error) return reject(error);
        consumer.pause();
        return resolve(consumer);
      })
    );
  }
  return Promise.reject(new Error('Consumer is not paused'));
};

export const closeConsumer = (
  socket: ITeckosClient,
  consumer: mediasoupClient.types.Consumer
): Promise<mediasoupClient.types.Consumer> =>
  new Promise<mediasoupClient.types.Consumer>((resolve, reject) =>
    socket.emit(RouterRequests.CloseConsumer, consumer.id, (error?: string) => {
      if (error) return reject(error);
      consumer.close();
      return resolve(consumer);
    })
  );
