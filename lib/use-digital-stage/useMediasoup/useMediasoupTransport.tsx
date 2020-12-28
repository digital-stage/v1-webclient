import { useCallback, useEffect, useState } from 'react';
import { ITeckosClient, TeckosClient } from 'teckos-client';
import mediasoupClient from 'mediasoup-client';
import { Device as MediasoupDevice } from 'mediasoup-client/lib/Device';
import debug from 'debug';
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
  LocalConsumer,
  LocalProducer,
  RemoteAudioProducer,
  RemoteVideoProducer,
  Router,
} from '../types';
import { ClientDeviceEvents } from '../global/SocketEvents';
import { AddAudioProducerPayload } from '../global/SocketPayloads';
import useSocket from '../useSocket';

const d = debug('useMediasoupTransport');
const trace = d.extend('info');
const err = d.extend('err');

const debugEffect = debug('useEffect:useMediasoupTransport');
const debugCleanup = debugEffect.extend('cleanup');

const TIMEOUT_MS = 5000;

const useMediasoupTransport = (options: {
  standaloneRouterUrl?: string;
  routerDistributorUrl?: string;
}): {
  ready: boolean;
  consume: (producer: RemoteVideoProducer | RemoteAudioProducer) => Promise<LocalConsumer>;
  stopConsuming: (consumer: LocalConsumer) => Promise<LocalConsumer>;
  produce: (track: MediaStreamTrack) => Promise<LocalProducer>;
  stopProducing: (producer: LocalProducer) => Promise<LocalProducer>;
} => {
  const { standaloneRouterUrl, routerDistributorUrl } = options;
  // Connection to router
  const [ready, setReady] = useState<boolean>(false);
  const [router, setRouter] = useState<Router>();
  const [routerConnection, setRouterConnection] = useState<ITeckosClient>();
  const [rtpCapabilities, setRtpCapabilities] = useState<mediasoupClient.types.RtpCapabilities>();
  const [mediasoupDevice, setMediasoupDevice] = useState<mediasoupClient.Device>();
  const [sendTransport, setSendTransport] = useState<mediasoupClient.types.Transport>();
  const [receiveTransport, setReceiveTransport] = useState<mediasoupClient.types.Transport>();
  const { socket: serverConnection } = useSocket();

  /**
   * GET FASTEST ROUTER
   */
  useEffect(() => {
    debugEffect('serverConnection routerDistUrl');
    if (serverConnection && routerDistributorUrl) {
      trace(`Using ${routerDistributorUrl}`);
      getFastestRouter(routerDistributorUrl)
        .then((fastestRouter) => {
          trace(`Fastest router is ${fastestRouter.url}`);
          return setRouter(fastestRouter);
        })
        .catch((error) => err(error));
      return () => {
        // TODO: Is this necessary?
        debugCleanup('serverConnection routerDistUrl - Cleaning up router');
        setRouter(undefined);
      };
    }
    return undefined;
  }, [serverConnection, routerDistributorUrl]);

  /**
   * HANDLE ROUTER CONNECTION
   */
  useEffect(() => {
    debugEffect('router');
    if (router || standaloneRouterUrl) {
      const url = router
        ? `${router.wsPrefix}://${router.url}:${router.port}${router.path ? `/${router.path}` : ''}`
        : (standaloneRouterUrl as string);
      trace(`Connecting to ${url}`);
      const conn = new TeckosClient(url);
      conn.on('connect_error', (error) => {
        err(error);
      });
      conn.on('connect_timeout', (error) => {
        err(error);
      });
      conn.on('connect', () => {
        trace(`Connected to router ${url} via socket communication`);
        setRouterConnection(conn);
      });

      conn.connect();

      return () => {
        debugCleanup('router - Cleaning up router connection');
        conn.close();
        setRouterConnection(undefined);
      };
    }
    return undefined;
  }, [router, standaloneRouterUrl]);

  useEffect(() => {
    debugEffect('routerConnection');
    if (routerConnection) {
      routerConnection.emit(
        RouterRequests.GetRTPCapabilities,
        {},
        (error: string, retrievedRtpCapabilities: mediasoupClient.types.RtpCapabilities) => {
          if (error) {
            return err(new Error(error));
          }
          trace('Retrieved rtp capabilities');
          return setRtpCapabilities(retrievedRtpCapabilities);
        }
      );
      return () => {
        debugCleanup('routerConnection - Cleaning up rtp capabilities');
        setRtpCapabilities(undefined);
      };
    }
    return undefined;
  }, [routerConnection]);

  useEffect(() => {
    debugEffect('rtpCapabilities');
    if (rtpCapabilities) {
      // Create mediasoup device
      const createdDevice = new MediasoupDevice();
      createdDevice
        .load({ routerRtpCapabilities: rtpCapabilities })
        .then(() => {
          trace('Created mediasoup device');
          return setMediasoupDevice(createdDevice);
        })
        .catch((error) => err(error));
      return () => {
        debugCleanup('rtpCapabilities - Cleaning up mediasoup device');
        setMediasoupDevice(undefined);
      };
    }
    return undefined;
  }, [rtpCapabilities]);

  useEffect(() => {
    debugEffect('routerConnection mediasoupDevice');
    if (routerConnection && mediasoupDevice) {
      let createdTransport: mediasoupClient.types.Transport;
      // Create send transport
      createWebRTCTransport(routerConnection, mediasoupDevice, 'send')
        .then((transport) => {
          createdTransport = transport;
          trace('Created send transport');
          return setSendTransport(createdTransport);
        })
        .catch((error) => err(error));

      return () => {
        debugCleanup('routerConnection mediasoupDevice - Cleaning up send transport');
        if (createdTransport) {
          createdTransport.close();
        }
      };
    }
    return undefined;
  }, [routerConnection, mediasoupDevice]);

  useEffect(() => {
    debugEffect('routerConnection mediasoupDevice');
    if (routerConnection && mediasoupDevice) {
      let createdTransport: mediasoupClient.types.Transport;
      // Create receive transport
      createWebRTCTransport(routerConnection, mediasoupDevice, 'receive')
        .then((transport) => {
          createdTransport = transport;
          return setReceiveTransport(createdTransport);
        })
        .catch((error) => err(error));

      return () => {
        debugCleanup('routerConnection mediasoupDevice - Cleaning up receive transport');
        if (createdTransport) createdTransport.close();
      };
    }
    return undefined;
  }, [routerConnection, mediasoupDevice]);

  const consume = useCallback(
    (producer: RemoteVideoProducer | RemoteAudioProducer): Promise<LocalConsumer> => {
      if (!producer) throw new Error('Producer is undefined');
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
            if (localConsumer.consumer.paused) {
              err('Still paused?');
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
      if (!consumer) throw new Error('Consumer is undefined');
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
      return consumer;
    },
    [routerConnection]
  );
  const produce = useCallback(
    (track: MediaStreamTrack): Promise<LocalProducer> => {
      if (!track) throw new Error('Track is undefined');
      if (serverConnection && routerConnection && mediasoupDevice && sendTransport) {
        return createProducer(sendTransport, track)
          .then((producer) => {
            if (producer.paused) {
              d('producer is paused');
            }
            return producer;
          })
          .then(
            (producer) =>
              new Promise<LocalProducer>((resolve, reject) => {
                const timeout = setTimeout(() => {
                  // TODO: Stop producing track first?
                  reject(new Error(`Timed out when publishing mediasoup producer ${producer.id}`));
                }, TIMEOUT_MS);
                serverConnection.emit(
                  track.kind === 'video'
                    ? ClientDeviceEvents.ADD_VIDEO_PRODUCER
                    : ClientDeviceEvents.ADD_AUDIO_PRODUCER,
                  {
                    routerProducerId: producer.id,
                  } as AddAudioProducerPayload,
                  (error: string | null, globalProducer: GlobalProducer) => {
                    clearTimeout(timeout);
                    if (error) {
                      // TODO: Stop producing track first?
                      err(error);
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
    [routerConnection, mediasoupDevice, sendTransport, serverConnection]
  );

  const stopProducing = useCallback(
    async (localProducer: LocalProducer): Promise<LocalProducer> => {
      if (!localProducer) throw new Error('Local producer is undefined');

      if (routerConnection && sendTransport) {
        d(`Stopping producer ${localProducer.global._id}`);
        await stopProducer(routerConnection, localProducer.local);
      } else {
        err('Stopped producer when not connected to router');
      }

      if (serverConnection) {
        d(`Unpublishing producer ${localProducer.global._id}`);
        await new Promise<LocalProducer>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(
              new Error(`Timed out when unpublishing global producer ${localProducer.global._id}`)
            );
          }, TIMEOUT_MS);
          serverConnection.emit(
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
        });
      }
      return localProducer;
    },
    [routerConnection, serverConnection, sendTransport]
  );

  useEffect(() => {
    if (routerConnection && serverConnection && receiveTransport && sendTransport) {
      debugEffect('routerConnection serverConnection receiveTransport sendTransport');
      setReady(true);
      return () => {
        debugCleanup(
          'routerConnection serverConnection receiveTransport sendTransport - Cleaning up ready'
        );
        setReady(false);
      };
    }
    return undefined;
  }, [routerConnection, serverConnection, receiveTransport, sendTransport]);

  return {
    ready,
    consume,
    stopConsuming,
    produce,
    stopProducing,
  };
};
export default useMediasoupTransport;
