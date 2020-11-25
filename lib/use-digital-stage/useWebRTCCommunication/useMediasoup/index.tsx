import { useCallback, useEffect, useState } from 'react';
import debug from 'debug';
import { ITeckosClient, TeckosClient } from 'teckos-client';
import mediasoupClient from 'mediasoup-client';
import { Device as MediasoupDevice } from 'mediasoup-client/lib/Device';
import omit from 'lodash/omit';
import {
  closeConsumer,
  createConsumer,
  createProducer,
  createWebRTCTransport,
  getFastestRouter,
  resumeConsumer,
  RouterRequests,
  stopProducer,
} from './util';
import {
  GlobalProducer,
  Router,
  RemoteAudioProducer,
  RemoteVideoProducer,
  LocalConsumer,
  LocalProducer,
} from '../../types';
import { ClientDeviceEvents } from '../../global/SocketEvents';
import useSocket from '../../useSocket';
import { AddAudioProducerPayload } from '../../global/SocketPayloads';

const TIMEOUT_MS = 5000;

const d = debug('useMediasoup');

const cu = d.extend('cleanup');

const err = d.extend('warn');

export interface TMediasoupContext {
  connected?: boolean;
  router?: Router;
  producers: {
    [trackId: string]: LocalProducer;
  };
  consumers: {
    [globalProducerId: string]: LocalConsumer;
  };
  consume: (producer: RemoteVideoProducer | RemoteAudioProducer) => Promise<LocalConsumer>;
  stopConsuming: (producerId: string) => Promise<LocalConsumer>;
  produce: (track: MediaStreamTrack) => Promise<LocalProducer>;
  stopProducing: (trackId: string) => Promise<LocalProducer>;
}

const useMediasoup = (
  routerDistUrl: string,
  handleError: (error: Error) => void
): TMediasoupContext => {
  const [connected, setConnected] = useState<boolean>(false);

  const { socket } = useSocket();

  // Router specific
  const [router, setRouter] = useState<Router>();
  const [routerConnection, setRouterConnection] = useState<ITeckosClient>();

  const [producers, setProducers] = useState<{
    [id: string]: LocalProducer;
  }>({});
  const [consumers, setConsumers] = useState<{
    [globalProducerId: string]: LocalConsumer;
  }>({});

  // Mediasoup specific
  const [rtpCapabilities, setRtpCapabilities] = useState<mediasoupClient.types.RtpCapabilities>();
  const [mediasoupDevice, setMediasoupDevice] = useState<mediasoupClient.Device>();
  const [sendTransport, setSendTransport] = useState<mediasoupClient.types.Transport>();
  const [receiveTransport, setReceiveTransport] = useState<mediasoupClient.types.Transport>();

  useEffect(() => {
    if (routerDistUrl && !router) {
      getFastestRouter(routerDistUrl)
        .then((fastestRouter) => {
          d(`Using the fastest available router: ${fastestRouter.url}`);
          return setRouter(fastestRouter);
        })
        .catch((error) => err(error));
    }
  }, [routerDistUrl, router]);

  useEffect(() => {
    if (router) {
      // Create connection to router
      const url = `${router.wsPrefix}://${router.url}:${router.port}${
        router.path ? `/${router.path}` : ''
      }`;
      const createdConnection = new TeckosClient(url);

      createdConnection.on('connect_error', (error) => {
        err(error);
      });

      createdConnection.on('connect_timeout', (error) => {
        err(error);
      });
      createdConnection.on('connect', () => {
        d('Connected to router via socket communication');
        setRouterConnection(createdConnection);
      });

      createdConnection.connect();

      return () => {
        cu('Closing socket connection to router');
        createdConnection.close();
        setRouterConnection(undefined);
      };
    }
    return undefined;
  }, [router]);

  useEffect(() => {
    if (routerConnection) {
      routerConnection.emit(
        RouterRequests.GetRTPCapabilities,
        {},
        (error: string, retrievedRtpCapabilities: mediasoupClient.types.RtpCapabilities) => {
          if (error) {
            return err(new Error(error));
          }
          d('Retrieved rtp capabilities');
          return setRtpCapabilities(retrievedRtpCapabilities);
        }
      );
      return () => {
        cu('Cleaning up rtp capabilities');
        setRtpCapabilities(undefined);
      };
    }
    return undefined;
  }, [routerConnection]);

  useEffect(() => {
    if (rtpCapabilities) {
      // Create mediasoup device
      const createdDevice = new MediasoupDevice();
      createdDevice
        .load({ routerRtpCapabilities: rtpCapabilities })
        .then(() => {
          return setMediasoupDevice(createdDevice);
        })
        .catch((error) => handleError(error));
    }
  }, [rtpCapabilities, handleError]);

  useEffect(() => {
    if (routerConnection && mediasoupDevice) {
      let createdTransport: mediasoupClient.types.Transport;
      // Create send transport
      createWebRTCTransport(routerConnection, mediasoupDevice, 'send')
        .then((transport) => {
          createdTransport = transport;
          return setSendTransport(createdTransport);
        })
        .catch((error) => handleError(error));

      return () => {
        cu('Closing send transport');
        if (createdTransport) createdTransport.close();
      };
    }
    return undefined;
  }, [routerConnection, mediasoupDevice, handleError]);

  useEffect(() => {
    if (routerConnection && mediasoupDevice) {
      let createdTransport: mediasoupClient.types.Transport;
      // Create receive transport
      createWebRTCTransport(routerConnection, mediasoupDevice, 'receive')
        .then((transport) => {
          createdTransport = transport;
          return setReceiveTransport(createdTransport);
        })
        .catch((error) => handleError(error));

      return () => {
        cu('Closing receive transport');
        if (createdTransport) createdTransport.close();
      };
    }
    return undefined;
  }, [routerConnection, mediasoupDevice, handleError]);

  const consume = useCallback(
    (producer: RemoteVideoProducer | RemoteAudioProducer): Promise<LocalConsumer> => {
      if (routerConnection && mediasoupDevice && receiveTransport) {
        if (!consumers[producer._id]) {
          return createConsumer(
            routerConnection,
            mediasoupDevice,
            receiveTransport,
            producer.globalProducerId
          )
            .then((consumer) => {
              const localConsumer: LocalConsumer = {
                _id: consumer.id,
                consumer,
                stageId: producer.stageId,
                stageMemberId: producer.stageMemberId,
                producerId: producer._id,
              };
              setConsumers((prev) => ({
                ...prev,
                [producer._id]: localConsumer,
              }));
              return localConsumer;
            })
            .then(async (localConsumer) => {
              if (localConsumer.consumer.paused) {
                await resumeConsumer(routerConnection, localConsumer.consumer);
              }
              return localConsumer;
            });
        }
        throw new Error(`Already consuming ${producer._id}`);
      }
      throw new Error(`Connection is not ready`);
    },
    [routerConnection, mediasoupDevice, receiveTransport, consumers]
  );

  const stopConsuming = useCallback(
    (producerId: string): Promise<LocalConsumer> => {
      if (routerConnection) {
        const consumer = consumers[producerId];
        if (consumer) {
          return closeConsumer(routerConnection, consumer.consumer).then(
            (): LocalConsumer => {
              setConsumers((prev) => omit(prev, producerId));
              return consumer;
            }
          );
        }
        throw new Error(`Could not find consumer for producer ${producerId}`);
      }
      throw new Error(`Connection is not ready`);
    },
    [routerConnection, consumers]
  );

  const produce = useCallback(
    (track: MediaStreamTrack): Promise<LocalProducer> => {
      if (routerConnection && mediasoupDevice && sendTransport && socket && router) {
        if (!producers[track.id]) {
          return createProducer(sendTransport, track)
            .then(
              (producer) =>
                new Promise<LocalProducer>((resolve, reject) => {
                  d(`Publishing mediasoup producer ${producer.id} globally`);
                  const timeout = setTimeout(() => {
                    // TODO: Stop producing track first?
                    d(`Timed out when publishing mediasoup producer ${producer.id}`);
                    reject(
                      new Error(`Timed out when publishing mediasoup producer ${producer.id}`)
                    );
                  }, TIMEOUT_MS);
                  socket.emit(
                    track.kind === 'video'
                      ? ClientDeviceEvents.ADD_VIDEO_PRODUCER
                      : ClientDeviceEvents.ADD_AUDIO_PRODUCER,
                    {
                      routerId: router._id,
                      routerProducerId: producer.id,
                    } as AddAudioProducerPayload,
                    (error: string | null, globalProducer: GlobalProducer) => {
                      clearTimeout(timeout);
                      if (error) {
                        // TODO: Stop producing track first?
                        reject(new Error(error));
                      }
                      d(
                        `Published mediasoup producer ${producer.id} globally: ${globalProducer._id}`
                      );
                      resolve({
                        global: globalProducer,
                        local: producer,
                      });
                    }
                  );
                })
            )
            .then((localProducer) => {
              setProducers((prev) => ({
                ...prev,
                [track.id]: localProducer,
              }));
              return localProducer;
            });
        }
        throw new Error(`Already consuming ${track.id}`);
      }
      throw new Error(`Connection is not ready`);
    },
    [routerConnection, router, mediasoupDevice, sendTransport, producers, socket]
  );

  const stopProducing = useCallback(
    (trackId: string): Promise<LocalProducer> => {
      if (routerConnection && socket) {
        const localProducer = producers[trackId];
        if (localProducer) {
          return stopProducer(routerConnection, localProducer.local).then(
            () =>
              new Promise<LocalProducer>((resolve, reject) => {
                d(`Unpublishing mediasoup producer ${localProducer.local.id} globally`);
                const timeout = setTimeout(() => {
                  d(`Timed out when unpublishing mediasoup producer ${localProducer.global._id}`);
                  reject(
                    new Error(
                      `Timed out when unpublishing mediasoup producer ${localProducer.global._id}`
                    )
                  );
                }, TIMEOUT_MS);
                socket.emit(
                  localProducer.local.kind === 'video'
                    ? ClientDeviceEvents.REMOVE_VIDEO_PRODUCER
                    : ClientDeviceEvents.REMOVE_AUDIO_PRODUCER,
                  localProducer.global._id,
                  (error?: string) => {
                    d(
                      `Unpublished mediasoup track ${localProducer.local.id} globally: ${localProducer.global._id}`
                    );
                    clearTimeout(timeout);
                    if (error) {
                      reject(new Error(error));
                    }
                    resolve(localProducer);
                  }
                );
              })
          );
        }
        throw new Error(`Could not find producer for track ${trackId}`);
      }
      throw new Error(`Connection is not ready`);
    },
    [routerConnection, producers, socket]
  );

  useEffect(() => {
    if (routerConnection && router && mediasoupDevice && sendTransport && receiveTransport) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [routerConnection, router, mediasoupDevice, sendTransport, receiveTransport]);

  return {
    connected,
    router,
    producers,
    consumers,
    consume,
    stopConsuming,
    produce,
    stopProducing,
  };
};
export default useMediasoup;
