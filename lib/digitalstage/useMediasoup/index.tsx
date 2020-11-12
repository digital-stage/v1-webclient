import React, { useCallback, useEffect, useState } from 'react';
import mediasoupClient from 'mediasoup-client';
import { Device as MediasoupDevice } from 'mediasoup-client/lib/Device';
import { TeckosClient } from 'teckos-client';
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
  GlobalAudioProducer,
  GlobalVideoProducer,
  Router,
} from '../common/model.server';
import { ClientDeviceEvents } from '../common/events';
import {
  AddAudioProducerPayload,
  AddVideoProducerPayload,
} from '../common/payloads';
import { useSocket } from '../useStageContext';
import { Device } from '../useStageContext/model';
import { useDispatch, useSelector } from '../useStageContext/redux';
import allActions from '../useStageContext/redux/actions';
import {
  AudioConsumers,
  AudioProducers,
  NormalizedState,
  VideoConsumers,
  VideoProducers,
} from '../useStageContext/schema';
import useStageSelector from '../useStageSelector';
import { useErrors } from '../../useErrors';

const TIMEOUT_MS = 4000;

const MediasoupContext = React.createContext(undefined);

export const MediasoupProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const socket = useSocket();
  const dispatch = useDispatch();
  const { reportError, reportWarning } = useErrors();

  const localDevice = useSelector<NormalizedState, Device>((state) => {
    if (state.devices.local) return state.devices.byId[state.devices.local];
    return undefined;
  });
  const audioConsumers = useStageSelector<AudioConsumers>(
    (state) => state.audioConsumers,
  );
  const videoConsumers = useStageSelector<VideoConsumers>(
    (state) => state.videoConsumers,
  );
  const videoProducers = useStageSelector<VideoProducers>(
    (state) => state.videoProducers,
  );
  const audioProducers = useStageSelector<AudioProducers>(
    (state) => state.audioProducers,
  );

  const [working, setWorking] = useState<boolean>(false);
  const [router, setRouter] = useState<Router>();
  const [connection, setConnection] = useState<TeckosClient>();
  const [device, setDevice] = useState<mediasoupClient.types.Device>();
  const [sendTransport, setSendTransport] = useState<
  mediasoupClient.types.Transport
  >();
  const [receiveTransport, setReceiveTransport] = useState<
  mediasoupClient.types.Transport
  >();
  const [sendVideo, setSendVideo] = useState<boolean>(false);
  const [sendAudio, setSendAudio] = useState<boolean>(false);
  const [receiveVideo, setReceiveVideo] = useState<boolean>(false);
  const [receiveAudio, setReceiveAudio] = useState<boolean>(false);
  const [inputAudioDeviceId, setInputAudioDeviceId] = useState<string>();
  const [inputVideoDeviceId, setInputVideoDeviceId] = useState<string>();
  const [outputAudioDeviceId, setOutputAudioDeviceId] = useState<string>();

  const [localAudioProducers, setLocalAudioProducers] = useState<
  {
    audioProducerId: string;
    msProducer: mediasoupClient.types.Producer;
  }[]
  >([]);
  const [localVideoProducers, setLocalVideoProducers] = useState<
  {
    videoProducerId: string;
    msProducer: mediasoupClient.types.Producer;
  }[]
  >([]);

  useEffect(() => {
    if (connection) {
      console.debug('Connection available');

      console.log('Emit hallo');
      connection.emit('HALLO');
      connection.emit(
        RouterRequests.GetRTPCapabilities,
        {},
        (
          error: string,
          rtpCapabilities: mediasoupClient.types.RtpCapabilities,
        ) => {
          console.debug('Got response');
          if (error) {
            return reportError(new Error(error));
          }
          // Create device
          const createdDevice = new MediasoupDevice();
          return createdDevice
            .load({ routerRtpCapabilities: rtpCapabilities })
            .then(() => Promise.all([
              createWebRTCTransport(
                connection,
                createdDevice,
                'send',
              ).then((transport) => setSendTransport(transport)),
              createWebRTCTransport(
                connection,
                createdDevice,
                'receive',
              ).then((transport) => setReceiveTransport(transport)),
            ]))
            .then(() => setDevice(createdDevice));
        },
      );
      return () => connection.removeAllListeners();
    }
    return null;
  }, [connection]);

  useEffect(() => {
    if (receiveTransport) {
      return () => {
        receiveTransport.close();
      };
    }
    return null;
  }, [receiveTransport]);

  useEffect(() => {
    if (sendTransport) {
      return () => {
        sendTransport.close();
      };
    }
    return null;
  }, [sendTransport]);

  useEffect(() => {
    if (router) {
      const url = `${(process.env.NEXT_PUBLIC_USE_SSL === 'true' ? 'wss://' : 'ws://') + router.url}:${router.port}`;

      const createdConnection = new TeckosClient(url, {
        verbose: true,
      });

      createdConnection.on('connect_error', (error) => {
        reportError(error);
      });

      createdConnection.on('connect_timeout', (error) => {
        reportError(error);
      });

      createdConnection.connect();

      createdConnection.emit('HALLO', {});
      createdConnection.emit('HALLO');
      console.debug('Set connection');
      setConnection(createdConnection);
      return () => {
        console.debug('Close connection');
        createdConnection.close();
      };
    }
    return null;
  }, [router]);

  useEffect(() => {
    getFastestRouter()
      .then((fastestRouter) => {
        setRouter(fastestRouter);
        console.debug(`[useMediasoup] Using router ${fastestRouter.url}`);
      })
      .catch((error) => {
        reportError(error.message);
      });
    return () => {
      setRouter(undefined);
    };
  }, []);

  const consumeVideoProducer = useCallback(
    (producerId: string) => {
      const producer = videoProducers.byId[producerId];
      if (producer) {
        return createConsumer(connection, device, receiveTransport, producer)
          .then((consumer) => {
            if (consumer.paused) return resumeConsumer(connection, consumer);
            return consumer;
          })
          .then((consumer) => dispatch(
            allActions.stageActions.client.addVideoConsumer({
              _id: consumer.id,
              stage: producer.stageId,
              stageMember: producer.stageMemberId,
              videoProducer: producer._id,
              msConsumer: consumer,
            }),
          ));
      }
      reportError(new Error(`Could not find producer=${producerId}`));
      return null;
    },
    [connection, device, receiveTransport, videoProducers, videoConsumers],
  );

  const stopConsumingVideoProducer = useCallback(
    (producerId: string) => {
      const consumerId = videoConsumers.byProducer[producerId];
      if (consumerId && videoConsumers.byId[consumerId]) {
        return closeConsumer(
          connection,
          videoConsumers.byId[consumerId].msConsumer,
        ).then(() => dispatch(
          allActions.stageActions.client.removeVideoConsumer(consumerId),
        ));
      }
      reportError(new Error(`Could not find consumer for producer ${producerId}`));
      return null;
    },
    [connection, videoConsumers],
  );

  const consumeAudioProducer = useCallback(
    (producerId: string) => {
      const producer = audioProducers.byId[producerId];
      if (producer) {
        return createConsumer(connection, device, receiveTransport, producer)
          .then((consumer) => {
            if (consumer.paused) return resumeConsumer(connection, consumer);
            return consumer;
          })
          .then((consumer) => dispatch(
            allActions.stageActions.client.addAudioConsumer({
              _id: consumer.id,
              stage: producer.stageId,
              stageMember: producer.stageMemberId,
              audioProducer: producer._id,
              msConsumer: consumer,
            }),
          ));
      }
      reportError(new Error(`Could not find producer=${producerId}`));
      return null;
    },
    [connection, device, receiveTransport, audioProducers, audioConsumers],
  );

  const stopConsumingAudioProducer = useCallback(
    (producerId: string) => {
      const consumerId = audioConsumers.byProducer[producerId];
      if (consumerId && audioConsumers.byId[consumerId]) {
        return closeConsumer(
          connection,
          audioConsumers.byId[consumerId].msConsumer,
        ).then(() => dispatch(
          allActions.stageActions.client.removeAudioConsumer(consumerId),
        ));
      }
      reportError(new Error(`Could not find consumer for producer ${producerId}`));
      return null;
    },
    [connection, audioConsumers],
  );

  const startStreamAudio = useCallback(() => {
    if (sendTransport) {
      setWorking(true);
      return navigator.mediaDevices
        .getUserMedia({
          video: false,
          audio: {
            deviceId: localDevice ? localDevice.inputAudioDeviceId : undefined,
            autoGainControl: false,
            echoCancellation: false,
            noiseSuppression: false,
          },
        })
        .then((stream) => stream.getAudioTracks())
        .then((tracks) => Promise.all(
          tracks.map((track) => createProducer(sendTransport, track)
            .then((producer) => new Promise((resolve, reject) => {
              socket.emit(
                ClientDeviceEvents.ADD_AUDIO_PRODUCER,
                {
                  routerId: router._id,
                  routerProducerId: producer.id,
                } as AddAudioProducerPayload,
                (
                  error: string | null,
                  globalProducer: GlobalAudioProducer,
                ) => {
                  if (error) {
                    reportWarning(new Error(error));
                    return stopProducer(socket, producer).then(() => reject(new Error(error)));
                  }
                  setLocalAudioProducers((prevState) => [
                    ...prevState,
                    {
                      audioProducerId: globalProducer._id,
                      msProducer: producer,
                    },
                  ]);
                  return resolve();
                },
              );
              setTimeout(() => {
                reject(
                  new Error(
                    `Timed out: ${ClientDeviceEvents.ADD_AUDIO_PRODUCER}`,
                  ),
                );
              }, TIMEOUT_MS);
            }))),
        ))
        .finally(() => setWorking(false));
    }
    reportError(new Error('FIXME: Send transport is still undefined ...'));
    return null;
  }, [sendTransport, localDevice]);

  const stopStreamingAudio = useCallback(() => {
    setWorking(true);
    // Assure, that we stop streaming all local audio producers
    return Promise.all(
      localAudioProducers
        .map((localAudioProducer) => stopProducer(
          connection,
          localAudioProducer.msProducer,
        )
          .then(() => new Promise((resolve, reject) => {
            socket.emit(
              ClientDeviceEvents.REMOVE_AUDIO_PRODUCER,
              localAudioProducer.audioProducerId,
              (error?: string) => {
                if (error) {
                  reject(new Error(error));
                }
                resolve();
              },
            );
            setTimeout(() => {
              reject(
                new Error(
                  `Timed out: ${ClientDeviceEvents.REMOVE_AUDIO_PRODUCER}`,
                ),
              );
            }, TIMEOUT_MS);
          }))
          .finally(() => setLocalAudioProducers((prevState) => prevState.filter(
            (p) => p.audioProducerId !== localAudioProducer.audioProducerId,
          )))),
    )
      .catch((error) => reportError(error.message))
      .finally(() => setWorking(false));
  }, [localAudioProducers]);

  const startStreamVideo = useCallback(() => {
    if (sendTransport) {
      setWorking(true);
      return navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video:
            localDevice && localDevice.inputVideoDeviceId
              ? {
                deviceId: localDevice.inputVideoDeviceId,
              }
              : true,
        })
        .then((stream) => stream.getVideoTracks())
        .then((tracks) => Promise.all(
          tracks
            .map((track) => createProducer(sendTransport, track)
              .then((producer) => new Promise((resolve, reject) => {
                socket.emit(
                  ClientDeviceEvents.ADD_VIDEO_PRODUCER,
                  {
                    routerId: router._id,
                    routerProducerId: producer.id,
                  } as AddVideoProducerPayload,
                  (
                    error: string | null,
                    globalProducer: GlobalVideoProducer,
                  ) => {
                    if (error) {
                      reportWarning(new Error(error));
                      return stopProducer(socket, producer).then(() => reject(new Error(error)));
                    }
                    setLocalVideoProducers((prevState) => [
                      ...prevState,
                      {
                        videoProducerId: globalProducer._id,
                        msProducer: producer,
                      },
                    ]);
                    return resolve();
                  },
                );
                setTimeout(() => {
                  reject(
                    new Error(
                      `Timed out: ${ClientDeviceEvents.ADD_VIDEO_PRODUCER}`,
                    ),
                  );
                }, TIMEOUT_MS);
              }))),
        ))
        .catch((error) => reportError(error.message))
        .finally(() => {
          setWorking(false);
        });
    }
    reportWarning(new Error('FIXME: Send transport is still undefined ...'));
    return null;
  }, [sendTransport, localDevice]);

  const stopStreamingVideo = useCallback(() => {
    setWorking(true);
    // Assure, that we stop streaming all local audio producers
    return Promise.all(
      localVideoProducers
        .map((localVideoProducer) => stopProducer(connection, localVideoProducer.msProducer)
          .then(
            () => new Promise((resolve, reject) => {
              socket.emit(
                ClientDeviceEvents.REMOVE_VIDEO_PRODUCER,
                localVideoProducer.videoProducerId,
                (error?: string) => {
                  if (error) {
                    reject(new Error(error));
                  }
                  resolve();
                },
              );
              setTimeout(() => {
                reject(
                  new Error(
                    `Timed out: ${ClientDeviceEvents.REMOVE_VIDEO_PRODUCER}`,
                  ),
                );
              }, TIMEOUT_MS);
            }).finally(() => setLocalVideoProducers((prevState) => prevState.filter(
              (p) => p.videoProducerId !== localVideoProducer.videoProducerId,
            ))),
          )),
    )
      .catch((error) => reportError(error.message))
      .finally(() => {
        setWorking(false);
      });
  }, [localVideoProducers]);

  useEffect(() => {
    if (!working && localDevice) {
      if (sendVideo !== localDevice.sendVideo) {
        if (localDevice.sendVideo) {
          startStreamVideo();
        } else {
          stopStreamingVideo();
        }
        setSendVideo(localDevice.sendVideo);
      }
      if (sendAudio !== localDevice.sendAudio) {
        if (localDevice.sendAudio) {
          startStreamAudio();
        } else {
          stopStreamingAudio();
        }
        setSendAudio(localDevice.sendAudio);
      }
      if (receiveVideo !== localDevice.receiveVideo) {
        setReceiveVideo(localDevice.receiveVideo);
      }
      if (receiveAudio !== localDevice.receiveAudio) {
        setReceiveAudio(localDevice.receiveAudio);
      }

      if (inputAudioDeviceId !== localDevice.inputAudioDeviceId) {
        setInputAudioDeviceId(localDevice.inputAudioDeviceId);
        if (localDevice.sendAudio) {
          stopStreamingAudio().then(() => startStreamAudio());
        }
      }
      if (inputVideoDeviceId !== localDevice.inputVideoDeviceId) {
        setInputVideoDeviceId(localDevice.inputVideoDeviceId);
        if (localDevice.sendVideo) {
          stopStreamingVideo().then(() => startStreamVideo());
        }
      }
      if (outputAudioDeviceId !== localDevice.outputAudioDeviceId) {
        setOutputAudioDeviceId(localDevice.outputAudioDeviceId);
      }
    }
  }, [working, localDevice]);

  const [handledVideoProducerIds, setHandledVideoProducerIds] = useState<
  string[]
  >([]);
  const [consumingVideoProducerIds, setConsumingVideoProducerIds] = useState<
  string[]
  >([]);
  const [handledAudioProducerIds, setHandledAudioProducerIds] = useState<
  string[]
  >([]);
  const [consumingAudioProducerIds, setConsumingAudioProducerIds] = useState<
  string[]
  >([]);

  const syncVideoProducers = useCallback(() => {
    setConsumingVideoProducerIds((prev) => {
      const addedVideoProducerIds = handledVideoProducerIds.filter(
        (id) => prev.indexOf(id) === -1,
      );
      const existingVideoProducerIds = handledVideoProducerIds.filter(
        (id) => prev.indexOf(id) !== -1,
      );
      const removedVideoProducerIds = prev.filter(
        (id) => handledVideoProducerIds.indexOf(id) === -1,
      );

      addedVideoProducerIds.map((producerId) => consumeVideoProducer(producerId));
      removedVideoProducerIds.map((producerId) => stopConsumingVideoProducer(producerId));

      return [...existingVideoProducerIds, ...addedVideoProducerIds];
    });
  }, [handledVideoProducerIds, consumingVideoProducerIds]);

  const syncAudioProducers = useCallback(() => {
    setConsumingAudioProducerIds((prev) => {
      const addedAudioProducerIds = handledAudioProducerIds.filter(
        (id) => prev.indexOf(id) === -1,
      );
      const existingAudioProducerIds = handledAudioProducerIds.filter(
        (id) => prev.indexOf(id) !== -1,
      );
      const removedAudioProducerIds = prev.filter(
        (id) => handledAudioProducerIds.indexOf(id) === -1,
      );

      addedAudioProducerIds.map((producerId) => consumeAudioProducer(producerId));
      removedAudioProducerIds.map((producerId) => stopConsumingAudioProducer(producerId));

      return [...existingAudioProducerIds, ...addedAudioProducerIds];
    });
  }, [handledAudioProducerIds, consumingAudioProducerIds]);

  useEffect(() => {
    syncVideoProducers();
  }, [handledVideoProducerIds]);

  useEffect(() => {
    syncAudioProducers();
  }, [handledAudioProducerIds]);

  useEffect(() => {
    if (receiveVideo) {
      setHandledVideoProducerIds(videoProducers.allIds);
    } else {
      setHandledVideoProducerIds([]);
    }
  }, [receiveVideo, videoProducers]);

  useEffect(() => {
    if (receiveAudio) {
      setHandledAudioProducerIds(audioProducers.allIds);
    } else {
      setHandledAudioProducerIds([]);
    }
  }, [receiveAudio, audioProducers]);

  return (
    <MediasoupContext.Provider value={undefined}>
      {children}
    </MediasoupContext.Provider>
  );
};

export default MediasoupProvider;
