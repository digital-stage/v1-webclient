import { useCallback, useEffect, useState } from 'react';
import debug from 'debug';
import { ITeckosClient, TeckosClient } from 'teckos-client';
import mediasoupClient from 'mediasoup-client';
import { Device as MediasoupDevice } from 'mediasoup-client/lib/Device';
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
  consume: (producer: RemoteVideoProducer | RemoteAudioProducer) => Promise<LocalConsumer>;
  stopConsuming: (consumer: LocalConsumer) => Promise<LocalConsumer>;
  produce: (track: MediaStreamTrack) => Promise<LocalProducer>;
  stopProducing: (producer: LocalProducer) => Promise<LocalProducer>;
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

  // Mediasoup specific
  const [rtpCapabilities, setRtpCapabilities] = useState<mediasoupClient.types.RtpCapabilities>();
  const [mediasoupDevice, setMediasoupDevice] = useState<mediasoupClient.Device>();
  const [sendTransport, setSendTransport] = useState<mediasoupClient.types.Transport>();
  const [receiveTransport, setReceiveTransport] = useState<mediasoupClient.types.Transport>();

  useEffect(() => {
    if (routerDistUrl) {
      getFastestRouter(routerDistUrl)
        .then((fastestRouter) => {
          d(`Using the fastest available router: ${fastestRouter.url}`);
          return setRouter(fastestRouter);
        })
        .catch((error) => err(error));
      return () => {
        cu('Cleanup: Unset router');
        setRouter(undefined);
      };
    }
    return undefined;
  }, [routerDistUrl]);

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

      d('Attaching connection cleanup handler');
      return () => {
        d('Cleaning up connection');
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
          d('Created mediasoup device');
          return setMediasoupDevice(createdDevice);
        })
        .catch((error) => handleError(error));
      return () => {
        cu('Cleaning up mediasoup device');
        setMediasoupDevice(undefined);
      };
    }
    return undefined;
  }, [rtpCapabilities, handleError]);

  useEffect(() => {
    if (routerConnection && mediasoupDevice) {
      let createdTransport: mediasoupClient.types.Transport;
      // Create send transport
      createWebRTCTransport(routerConnection, mediasoupDevice, 'send')
        .then((transport) => {
          createdTransport = transport;
          d('Created send transport');
          return setSendTransport(createdTransport);
        })
        .catch((error) => handleError(error));

      return () => {
        cu('Cleaning up send transport');
        if (createdTransport) {
          createdTransport.close();
        }
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
          d('Created receive transport');
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

  useEffect(() => {
    if (routerConnection && router && mediasoupDevice && sendTransport && receiveTransport) {
      d('Connected');
      setConnected(true);

      return () => {
        cu('Cleaning up connection state');
        setConnected(false);
      };
    }
    return undefined;
  }, [routerConnection, router, mediasoupDevice, sendTransport, receiveTransport]);

  const consume = useCallback(
    (producer: RemoteVideoProducer | RemoteAudioProducer): Promise<LocalConsumer> => {
      if (routerConnection && mediasoupDevice && receiveTransport) {
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
            return localConsumer;
          })
          .then(async (localConsumer) => {
            if (localConsumer.consumer.paused) {
              d('Consumer is paused, try to resume it');
              await resumeConsumer(routerConnection, localConsumer.consumer);
            }
            return localConsumer;
          });
      }
      throw new Error('Not connected');
    },
    [routerConnection, mediasoupDevice, receiveTransport]
  );

  const stopConsuming = useCallback(
    async (consumer: LocalConsumer): Promise<LocalConsumer> => {
      if (routerConnection) {
        d(`Closing consumer ${consumer._id}`);
        await closeConsumer(routerConnection, consumer.consumer).then(
          (): LocalConsumer => {
            return consumer;
          }
        );
      } else {
        err('Stopped consumer when not connected to router');
      }

      d(`Removing consumer ${consumer._id}`);
      return consumer;
    },
    [routerConnection]
  );

  const produce = useCallback(
    (track: MediaStreamTrack): Promise<LocalProducer> => {
      if (routerConnection && mediasoupDevice && sendTransport && socket && router) {
        return createProducer(sendTransport, track).then(
          (producer) =>
            new Promise<LocalProducer>((resolve, reject) => {
              const timeout = setTimeout(() => {
                // TODO: Stop producing track first?
                reject(new Error(`Timed out when publishing mediasoup producer ${producer.id}`));
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
                  d(`Published producer ${globalProducer._id}`);
                  resolve({
                    global: globalProducer,
                    local: producer,
                  });
                }
              );
            })
        );
      }
      throw new Error(`Connection is not ready`);
    },
    [routerConnection, router, mediasoupDevice, sendTransport, socket]
  );

  const stopProducing = useCallback(
    async (localProducer: LocalProducer): Promise<LocalProducer> => {
      if (routerConnection) {
        d(`Stopping producer ${localProducer.global._id}`);
        await stopProducer(routerConnection, localProducer.local);
      } else {
        err('Stopped producer when not connected to router');
      }

      if (socket) {
        d(`Unpublishing producer ${localProducer.global._id}`);
        await new Promise<LocalProducer>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(
              new Error(`Timed out when unpublishing global producer ${localProducer.global._id}`)
            );
          }, TIMEOUT_MS);
          if (socket) {
            socket.emit(
              localProducer.local.kind === 'video'
                ? ClientDeviceEvents.REMOVE_VIDEO_PRODUCER
                : ClientDeviceEvents.REMOVE_AUDIO_PRODUCER,
              localProducer.global._id,
              (error?: string) => {
                clearTimeout(timeout);
                if (error) {
                  reject(new Error(error));
                }
                resolve(localProducer);
              }
            );
          } else {
            err('Stopped consumer when not connected to stage server');
          }
        });
      }
      return localProducer;
    },
    [routerConnection, socket]
  );

  return {
    connected,
    router,
    consume,
    stopConsuming,
    produce,
    stopProducing,
  };
};

export default useMediasoup;
