import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import debug from 'debug';
import { useDispatch } from 'react-redux';
import { omit } from 'lodash';
import {
  Router,
  RemoteAudioProducer,
  RemoteVideoProducer,
  LocalProducer,
  LocalConsumer,
} from '../types';
import useLocalDevice from '../hooks/useLocalDevice';
import useMediasoup from './useMediasoup';
import useAudioProducers from '../hooks/useAudioProducers';
import useVideoProducers from '../hooks/useVideoProducers';
import allActions from '../redux/actions';

interface TWebRTCCommunicationContext {
  router?: Router;
}

const d = debug('useWebRTCCommunication');

const cu = d.extend('cleanup');

const WebRTCCommunicationContext = createContext<TWebRTCCommunicationContext>({});

function isAudioProducer(
  producer: RemoteVideoProducer | RemoteAudioProducer
): producer is RemoteAudioProducer {
  return (producer as RemoteAudioProducer).volume !== undefined;
}

export const WebRTCCommunicationProvider = (props: {
  children: React.ReactNode;
  routerDistUrl: string;
  handleError: (error: Error) => void;
}): JSX.Element => {
  const { children, routerDistUrl, handleError } = props;
  const { router, connected, consume, stopConsuming, produce, stopProducing } = useMediasoup(
    routerDistUrl,
    handleError
  );

  const dispatch = useDispatch();

  // Automated Device handling
  const localDevice = useLocalDevice();
  const [working, setWorking] = useState<boolean>(false);
  const remoteVideoProducers = useVideoProducers();
  const remoteAudioProducers = useAudioProducers();
  const [producers, setProducers] = useState<{
    [trackId: string]: LocalProducer;
  }>({});
  const [consumers, setConsumers] = useState<{
    [globalProducerId: string]: LocalConsumer;
  }>({});
  const [sendAudio, setSendAudio] = useState<boolean>(false);
  const [sendVideo, setSendVideo] = useState<boolean>(false);
  const [receiveVideo, setReceiveVideo] = useState<boolean>(false);
  const [receiveAudio, setReceiveAudio] = useState<boolean>(false);
  const [inputVideoDeviceId, setInputVideoDeviceId] = useState<string>();
  const [inputAudioDeviceId, setInputAudioDeviceId] = useState<string>();

  const getVideoTracks = useCallback(() => {
    return navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: inputVideoDeviceId
          ? {
              deviceId: inputVideoDeviceId,
            }
          : true,
      })
      .then((stream) => stream.getVideoTracks());
  }, [inputVideoDeviceId]);

  const getAudioTracks = useCallback(() => {
    return navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: {
          deviceId: inputAudioDeviceId || undefined,
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
        },
      })
      .then((stream) => stream.getAudioTracks());
  }, [inputAudioDeviceId]);

  const startSendingVideo = useCallback(() => {
    d('Start sending video');
    setWorking(true);
    return getVideoTracks()
      .then((tracks) =>
        Promise.all(
          tracks.map((track) =>
            produce(track)
              .then((localProducer) =>
                setProducers((prev) => ({
                  ...prev,
                  [track.id]: localProducer,
                }))
              )
              .catch((error) => handleError(error))
          )
        )
      )
      .finally(() => setWorking(false));
  }, [setWorking, getVideoTracks, produce, handleError]);

  const stopSendingVideo = useCallback(() => {
    d('Stop sending video');
    setWorking(true);
    return Promise.all(
      Object.entries(producers)
        .filter((entry) => entry[1].local.kind === 'video')
        .map(([trackId, localProducer]) => {
          d(`Stop producing ${trackId}`);
          stopProducing(localProducer).catch((error) => handleError(error));
        })
    ).finally(() => setWorking(false));
  }, [setWorking, producers, stopProducing, handleError]);

  const startSendingAudio = useCallback(() => {
    d('Start sending audio');
    setWorking(true);
    return getAudioTracks()
      .then((tracks) =>
        Promise.all(
          tracks.map((track) =>
            produce(track)
              .then((localProducer) =>
                setProducers((prev) => ({
                  ...prev,
                  [track.id]: localProducer,
                }))
              )
              .catch((error) => handleError(error))
          )
        )
      )
      .finally(() => setWorking(false));
  }, [setWorking, getAudioTracks, produce, handleError]);

  const stopSendingAudio = useCallback(() => {
    d('Stop sending audio');
    setWorking(true);
    return Promise.all(
      Object.entries(producers)
        .filter((entry) => entry[1].local.kind === 'audio')
        .map(([trackId, localProducer]) => {
          d(`Stop producing ${trackId}`);
          stopProducing(localProducer).catch((error) => handleError(error));
        })
    ).finally(() => setWorking(false));
  }, [setWorking, producers, stopProducing, handleError]);

  const consumeRemoteProducer = useCallback(
    (remoteProducer: RemoteVideoProducer | RemoteAudioProducer): Promise<LocalConsumer> => {
      return consume(remoteProducer)
        .then((localConsumer) => {
          d(`Consuming now remote producer ${remoteProducer._id}`);
          const action = isAudioProducer(remoteProducer)
            ? allActions.stageActions.client.addAudioConsumer(localConsumer)
            : allActions.stageActions.client.addVideoConsumer(localConsumer);
          dispatch(action);
          return localConsumer;
        })
        .then((localConsumer) => {
          setConsumers((prev) => ({
            ...prev,
            [remoteProducer._id]: localConsumer,
          }));
          return localConsumer;
        });
    },
    [consume, dispatch]
  );

  const stopConsumingRemoteProducer = useCallback(
    (consumer: LocalConsumer): Promise<LocalConsumer> => {
      d(`Stop consuming remote producer ${consumer.producerId}`);
      return stopConsuming(consumer).then((localConsumer) => {
        d(`Stopped consuming remote producer ${consumer.producerId}`);
        const action =
          localConsumer.consumer.kind === 'audio'
            ? allActions.stageActions.client.removeAudioConsumer(localConsumer._id)
            : allActions.stageActions.client.removeVideoConsumer(localConsumer._id);
        dispatch(action);
        setConsumers((prev) => omit(prev, consumer.producerId));
        return localConsumer;
      });
    },
    [stopConsuming, dispatch]
  );

  useEffect(() => {
    if (connected && localDevice && !working) {
      d('Device changed');
      if (localDevice.sendVideo !== sendVideo) {
        d('Send video changed');
        if (localDevice.sendVideo) {
          startSendingVideo().catch((err) => handleError(err));
        } else {
          stopSendingVideo().catch((err) => handleError(err));
        }
        setSendVideo(localDevice.sendVideo);
      }
      if (localDevice.sendAudio !== sendAudio) {
        d('Send audio changed');
        if (localDevice.sendAudio) {
          startSendingAudio().catch((err) => handleError(err));
        } else {
          stopSendingAudio().catch((err) => handleError(err));
        }
        setSendAudio(localDevice.sendAudio);
      }
      if (localDevice.receiveAudio !== receiveAudio) {
        d('Receive audio changed');
        setReceiveAudio(localDevice.receiveAudio);
      }
      if (localDevice.receiveVideo !== receiveVideo) {
        d('Receive video changed');
        setReceiveVideo(localDevice.receiveVideo);
      }
      if (localDevice.inputVideoDeviceId !== inputVideoDeviceId) {
        d('Input audio device ID changed');
        setInputVideoDeviceId(localDevice.inputVideoDeviceId);
        if (localDevice.sendVideo) {
          stopSendingVideo()
            .then(() => startSendingVideo())
            .catch((err) => handleError(err));
        }
      }
      if (localDevice.inputAudioDeviceId !== inputAudioDeviceId) {
        d('Input video device ID changed');
        setInputAudioDeviceId(localDevice.inputAudioDeviceId);
        if (localDevice.sendAudio) {
          stopSendingAudio()
            .then(() => startSendingAudio())
            .catch((err) => handleError(err));
        }
      }
    }
  }, [
    connected,
    localDevice,
    working,
    sendVideo,
    sendAudio,
    receiveAudio,
    receiveVideo,
    inputVideoDeviceId,
    inputAudioDeviceId,
  ]);

  useEffect(() => {
    // Clean up deprecated consumers
    const obsoleteProducers = Object.keys(consumers)
      .filter(
        (producerId) =>
          !remoteVideoProducers.byId[producerId] && !remoteAudioProducers.byId[producerId]
      )
      .map((producerId) => consumers[producerId]);

    d(`Have ${obsoleteProducers.length} deprecated producers`);
    obsoleteProducers.forEach((obsoleteProducer) =>
      stopConsumingRemoteProducer(obsoleteProducer).catch((err) => handleError(err))
    );
  }, [consumers, handleError, remoteVideoProducers, remoteAudioProducers]);

  useEffect(() => {
    if (connected && receiveVideo) {
      remoteVideoProducers.allIds.forEach((producerId) => {
        if (!consumers[producerId]) {
          d(`Consuming video producer ${producerId}`);
          const producer = remoteVideoProducers.byId[producerId];
          consumeRemoteProducer(producer).catch((err) => handleError(err));
        }
      });
    }
  }, [connected, receiveVideo, remoteVideoProducers, consumers]);

  useEffect(() => {
    if (connected && receiveAudio) {
      remoteAudioProducers.allIds.forEach((producerId) => {
        if (!consumers[producerId]) {
          d(`Consuming audio producer ${producerId}`);
          const producer = remoteAudioProducers.byId[producerId];
          consumeRemoteProducer(producer).catch((err) => handleError(err));
        }
      });
    }
  }, [connected, receiveAudio, remoteAudioProducers, consumers, handleError]);

  useEffect(() => {
    if (connected) {
      return () => {
        cu('Clean up local producer and consumers');
        Promise.all([stopSendingAudio(), stopSendingVideo()]).catch((err) => handleError(err));
      };
    }
    return undefined;
  }, [connected, handleError]);

  useEffect(() => {
    d(producers);
  }, [producers]);

  return (
    <WebRTCCommunicationContext.Provider value={{ router }}>
      {children}
    </WebRTCCommunicationContext.Provider>
  );
};
const useWebRTCCommunication = (): TWebRTCCommunicationContext =>
  useContext<TWebRTCCommunicationContext>(WebRTCCommunicationContext);
export default useWebRTCCommunication;
