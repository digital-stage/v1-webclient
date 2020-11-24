import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import debug from 'debug';
import { useDispatch } from 'react-redux';
import { Device, Router, RemoteAudioProducer, RemoteVideoProducer, LocalProducer } from '../types';
import useLocalDevice from '../hooks/useLocalDevice';
import useMediasoup from './useMediasoup';
import useAudioProducers from '../hooks/useAudioProducers';
import useVideoProducers from '../hooks/useVideoProducers';
import allActions from '../redux/actions';

interface TWebRTCCommunicationContext {
  router?: Router;
}

const d = debug('useWebRTCCommunication');

const WebRTCCommunicationContext = createContext<TWebRTCCommunicationContext>({});

function isAudioProducer(
  producer: RemoteVideoProducer | RemoteAudioProducer
): producer is RemoteAudioProducer {
  return (producer as RemoteAudioProducer).volume !== undefined;
}

export const WebRTCCommunicationProvider = (props: {
  children: React.ReactNode;
  routerDistUrl: string;
  handleError: (error: Error) => any;
}) => {
  const { children, routerDistUrl, handleError } = props;
  const {
    router,
    producers,
    connected,
    consumers,
    consume,
    stopConsuming,
    produce,
    stopProducing,
  } = useMediasoup(routerDistUrl);

  const dispatch = useDispatch();

  // Automated Device handling
  const localDevice = useLocalDevice();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-ignore
  const [working, setWorking] = useState<boolean>(false);
  const remoteVideoProducers = useVideoProducers();
  const remoteAudioProducers = useAudioProducers();
  const [sendAudio, setSendAudio] = useState<boolean>(false);
  const [sendVideo, setSendVideo] = useState<boolean>(false);
  const [receiveVideo, setReceiveVideo] = useState<boolean>(false);
  const [receiveAudio, setReceiveAudio] = useState<boolean>(false);

  const consumeRemoteProducer = useCallback(
    (remoteProducer: RemoteVideoProducer | RemoteAudioProducer) => {
      consume(remoteProducer).then((localConsumer) => {
        d(`Consuming now remote producer ${remoteProducer._id}`);
        const action = isAudioProducer(remoteProducer)
          ? allActions.stageActions.client.addAudioConsumer(localConsumer)
          : allActions.stageActions.client.addVideoConsumer(localConsumer);
        dispatch(action);
      });
    },
    [consume, dispatch]
  );

  const stopConsumingRemoteProducer = useCallback(
    (producerId: string) => {
      if (stopConsuming) {
        d(`Stop consuming remote producer ${producerId}`);
        stopConsuming(producerId).then((localConsumer) => {
          d(`Stopped consuming remote producer ${producerId}`);
          const action =
            localConsumer.consumer.kind === 'audio'
              ? allActions.stageActions.client.removeAudioConsumer(localConsumer._id)
              : allActions.stageActions.client.removeVideoConsumer(localConsumer._id);
          dispatch(action);
        });
      }
    },
    [stopConsuming, dispatch]
  );

  useEffect(() => {
    if (connected && consumeRemoteProducer && stopConsumingRemoteProducer) {
      d('Check for and removing consumers of obsolete producers');
      // Clean up deprecated consumers
      const obsoleteProducerIds = Object.keys(consumers).filter(
        (producerId) =>
          !remoteVideoProducers.byId[producerId] && !remoteAudioProducers.byId[producerId]
      );

      d(`Have ${obsoleteProducerIds.length} deprecated producers`);
      obsoleteProducerIds.forEach((obsoleteProducerId) => {
        stopConsumingRemoteProducer(obsoleteProducerId);
      });

      if (receiveAudio) {
        remoteAudioProducers.allIds.forEach((producerId) => {
          if (!consumers[producerId]) {
            d(`Consuming audio producer ${producerId}`);
            const producer = remoteAudioProducers.byId[producerId];
            consumeRemoteProducer(producer);
          }
        });
      } else {
        remoteAudioProducers.allIds.forEach((producerId) => {
          if (consumers[producerId]) {
            d(`Stop consuming audio producer ${producerId}`);
            stopConsumingRemoteProducer(producerId);
          }
        });
      }
      if (receiveVideo) {
        // Clean up all video consumers
        remoteVideoProducers.allIds.forEach((producerId) => {
          if (!consumers[producerId]) {
            d(`Consuming video producer ${producerId}`);
            const producer = remoteVideoProducers.byId[producerId];
            consumeRemoteProducer(producer);
          }
        });
      } else {
        remoteVideoProducers.allIds.forEach((producerId) => {
          if (consumers[producerId]) {
            d(`Stop consuming video producer ${producerId}`);
            stopConsumingRemoteProducer(producerId);
          }
        });
      }
    }
  }, [
    connected,
    receiveAudio,
    receiveVideo,
    remoteVideoProducers,
    remoteAudioProducers,
    consumers,
    consumeRemoteProducer,
    stopConsumingRemoteProducer,
    dispatch,
  ]);

  const startSendingVideo = useCallback(
    (dev: Device): Promise<LocalProducer[]> => {
      d('Start sending video');
      setWorking(true);
      return navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video:
            dev && dev.inputVideoDeviceId
              ? {
                  deviceId: dev.inputVideoDeviceId,
                }
              : true,
        })
        .then((stream) => stream.getVideoTracks())
        .then((tracks) => {
          d(`Producing now ${tracks.length} video tracks`);
          return tracks;
        })
        .then((tracks) => Promise.all(tracks.map((track) => produce(track))))
        .finally(() => setWorking(false));
    },
    [setWorking, produce]
  );

  const stopSendingVideo = useCallback((): Promise<LocalProducer[]> => {
    d('Stop sending video');
    setWorking(true);
    const videoProducerIds = Object.keys(producers).filter(
      (id) => producers[id].local.kind === 'video'
    );
    return Promise.all(
      videoProducerIds.map((videoProducerId) => stopProducing(videoProducerId))
    ).finally(() => setWorking(false));
  }, [setWorking, producers, stopProducing]);

  const startSendingAudio = useCallback(
    (dev: Device): Promise<LocalProducer[]> => {
      d('Start sending audio');
      setWorking(true);
      return navigator.mediaDevices
        .getUserMedia({
          video: false,
          audio: {
            deviceId: dev ? dev.inputAudioDeviceId : undefined,
            autoGainControl: false,
            echoCancellation: false,
            noiseSuppression: false,
          },
        })
        .then((stream) => stream.getAudioTracks())
        .then((tracks) => {
          d(`Producing now ${tracks.length} audio tracks`);
          return tracks;
        })
        .then((tracks) => Promise.all(tracks.map((track) => produce(track))))
        .finally(() => setWorking(false));
    },
    [setWorking, produce]
  );

  const stopSendingAudio = useCallback((): Promise<LocalProducer[]> => {
    d('Stop sending audio');
    setWorking(true);
    const audioProducerIds = Object.keys(producers).filter(
      (id) => producers[id].local.kind === 'audio'
    );
    return Promise.all(
      audioProducerIds.map((audioProducerId) => stopProducing(audioProducerId))
    ).finally(() => setWorking(false));
  }, [setWorking, producers, stopProducing]);

  const sync = useCallback(() => {
    if (localDevice) {
      if (localDevice.sendVideo !== sendVideo) {
        if (localDevice.sendVideo) {
          d('Send video on');
          startSendingVideo(localDevice).catch((error) => handleError(error));
        } else {
          d('Send video off');
          stopSendingVideo().catch((error) => handleError(error));
        }
        setSendVideo(localDevice.sendVideo);
      }
      if (localDevice.sendAudio !== sendAudio) {
        if (localDevice.sendAudio) {
          d('Send audio on');
          startSendingAudio(localDevice).catch((error) => handleError(error));
        } else {
          d('Send audio off');
          stopSendingAudio().catch((error) => handleError(error));
        }
        setSendAudio(localDevice.sendAudio);
      }
      if (localDevice.receiveVideo !== receiveVideo) {
        if (localDevice.receiveVideo) {
          d('Receive video on');
        } else {
          d('Receive video off');
        }
        setReceiveVideo(localDevice.receiveVideo);
      }
      if (localDevice.receiveAudio !== receiveAudio) {
        if (localDevice.receiveAudio) {
          d('Receive audio on');
        } else {
          d('Receive audio off');
        }
        setReceiveAudio(localDevice.receiveAudio);
      }
    } else {
      setSendVideo(false);
      setSendAudio(false);
      setReceiveVideo(false);
      setReceiveAudio(false);
    }
  }, [
    localDevice,
    sendVideo,
    sendAudio,
    receiveVideo,
    receiveAudio,
    startSendingVideo,
    startSendingAudio,
    stopSendingAudio,
    stopSendingVideo,
    handleError,
  ]);

  useEffect(() => {
    if (connected && !working) {
      if (!working) {
        sync();
      }
    }
  }, [connected, working, sync]);

  useEffect(() => {
    d('Connected changed');
  }, [connected]);

  return (
    <WebRTCCommunicationContext.Provider value={{ router }}>
      {children}
    </WebRTCCommunicationContext.Provider>
  );
};
const useWebRTCCommunication = (): TWebRTCCommunicationContext =>
  useContext<TWebRTCCommunicationContext>(WebRTCCommunicationContext);
export default useWebRTCCommunication;
