import React, { useCallback, useEffect, useState } from 'react';
import debug from 'debug';
import omit from 'lodash/omit';
import {
  useAudioConsumers,
  useAudioProducers,
  useLocalDevice,
  useVideoConsumers,
  useVideoProducers,
} from '../hooks';
import useDispatch from '../redux/useDispatch';
import useMediasoupTransport from './useMediasoupTransport';
import allActions from '../redux/actions';
import { LocalConsumer, LocalProducer, RemoteAudioProducer, RemoteVideoProducer } from '../types';
import { getAudioTracks, getVideoTracks } from './util';

const sampleRate: number | undefined = process.env.NEXT_PUBLIC_FIXED_SAMPLERATE
  ? parseInt(process.env.NEXT_PUBLIC_FIXED_SAMPLERATE, 10)
  : undefined;

const report = debug('useMediasoup');
const reportError = report.extend('error');

const reportEffect = debug('useEffect:useMediasoup');

function isAudioProducer(
  producer: RemoteVideoProducer | RemoteAudioProducer
): producer is RemoteAudioProducer {
  return (producer as RemoteAudioProducer).volume !== undefined;
}

const MediasoupProvider = (props: {
  children: React.ReactNode;
  standaloneRouterUrl?: string;
  routerDistributorUrl?: string;
}): JSX.Element => {
  const { children, standaloneRouterUrl, routerDistributorUrl } = props;
  const dispatch = useDispatch();

  // Local device handling
  const localDevice = useLocalDevice();
  const [sendAudio, setSendAudio] = useState<boolean>(false);
  const [sendVideo, setSendVideo] = useState<boolean>(false);
  const [receiveVideo, setReceiveVideo] = useState<boolean>(false);
  const [receiveAudio, setReceiveAudio] = useState<boolean>(false);
  const [sendAudioOptions, setSendAudioOptions] = useState<{
    inputAudioDeviceId?: string;
    autoGainControl?: boolean;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
  }>(
    localDevice
      ? {
          inputAudioDeviceId: localDevice.inputAudioDeviceId || undefined,
          autoGainControl: localDevice.autoGainControl || false,
          echoCancellation: localDevice.echoCancellation || false,
          noiseSuppression: localDevice.noiseSuppression || false,
        }
      : {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
        }
  );
  const [inputVideoDeviceId, setInputVideoDeviceId] = useState<string | undefined>(
    localDevice ? localDevice.inputVideoDeviceId : undefined
  );

  const { ready, consume, produce, stopProducing, stopConsuming } = useMediasoupTransport({
    routerDistributorUrl,
    standaloneRouterUrl,
  });

  const audioProducers = useAudioProducers();
  const videoProducers = useVideoProducers();
  const audioConsumers = useAudioConsumers();
  const videoConsumers = useVideoConsumers();

  const [, setLocalVideoProducers] = useState<LocalProducer[]>([]);
  const [, setLocalAudioProducers] = useState<LocalProducer[]>([]);

  const [, setConsumerList] = useState<{
    [producerId: string]: boolean;
  }>({});

  const createConsumer = useCallback(
    (producer: RemoteVideoProducer | RemoteAudioProducer): void => {
      setConsumerList((prev) => {
        if (!prev[producer._id]) {
          // CONSUME
          consume(producer)
            .then((consumer) => {
              if (isAudioProducer(producer)) {
                dispatch(allActions.stageActions.client.addAudioConsumer(consumer));
              } else {
                dispatch(allActions.stageActions.client.addVideoConsumer(consumer));
              }
              return undefined;
            })
            .catch((error) => reportError(error));
          return {
            ...prev,
            [producer._id]: true,
          };
        }
        return prev;
      });
    },
    [consume, dispatch]
  );

  const removeConsumer = useCallback(
    (consumer: LocalConsumer, type: 'audio' | 'video'): void => {
      setConsumerList((prev) => {
        if (prev[consumer.producerId]) {
          stopConsuming(consumer)
            .then(() => undefined)
            .finally(() => {
              if (type === 'video') {
                dispatch(allActions.stageActions.client.removeVideoConsumer(consumer._id));
              } else {
                dispatch(allActions.stageActions.client.removeAudioConsumer(consumer._id));
              }
            })
            .catch((error) => reportError(error));
          return omit(prev, consumer.producerId);
        }
        return prev;
      });
    },
    [stopConsuming, dispatch]
  );

  /** ******************************************
   * VIDEO HANDLING
   */
  const shareVideo = useCallback(
    (tracks: MediaStreamTrack[]) => {
      return Promise.all(tracks.map((track) => produce(track))).then((localProducers) =>
        setLocalVideoProducers((prev) => [...prev, ...localProducers])
      );
    },
    [produce]
  );
  const stopSharingVideo = useCallback(() => {
    setLocalVideoProducers((prev) => {
      prev.forEach((localProducer) => stopProducing(localProducer));
      return [];
    });
  }, [stopProducing]);
  useEffect(() => {
    if (ready) {
      if (receiveVideo) {
        const producersWithoutConsumer = videoProducers.allIds
          .filter((producerId) => !videoConsumers.byProducer[producerId])
          .map((id) => videoProducers.byId[id]);
        const consumersWithoutProducer = videoConsumers.allIds
          .map((id) => videoConsumers.byId[id])
          .filter((consumer) => !videoProducers.byId[consumer.producerId]);
        producersWithoutConsumer.forEach((producer) => createConsumer(producer));
        consumersWithoutProducer.forEach((consumer) => removeConsumer(consumer, 'video'));
      } else {
        videoConsumers.allIds
          .map((id) => videoConsumers.byId[id])
          .forEach((consumer) => removeConsumer(consumer, 'video'));
      }
    }
    return undefined;
  }, [ready, receiveVideo, videoConsumers, videoProducers, createConsumer, removeConsumer]);
  useEffect(() => {
    if (ready) {
      reportEffect('ready sendVideo');
      if (sendVideo) {
        getVideoTracks(inputVideoDeviceId)
          .then((tracks) => shareVideo(tracks))
          .catch((error) => reportError(error));
        return () => stopSharingVideo();
      }
    }
    return undefined;
  }, [ready, sendVideo, inputVideoDeviceId, shareVideo, stopSharingVideo]);

  /** ******************************************
   * AUDIO HANDLING
   */
  const shareAudio = useCallback(
    (tracks: MediaStreamTrack[]) => {
      return Promise.all(tracks.map((track) => produce(track))).then((localProducers) =>
        setLocalAudioProducers((prev) => [...prev, ...localProducers])
      );
    },
    [produce]
  );
  const stopSharingAudio = useCallback(() => {
    report('Stop sharing audio');
    setLocalAudioProducers((prev) => {
      prev.forEach((localProducer) => stopProducing(localProducer));
      return [];
    });
  }, [stopProducing]);
  useEffect(() => {
    if (ready) {
      if (receiveAudio) {
        const producersWithoutConsumer = audioProducers.allIds
          .filter((producerId) => !audioConsumers.byProducer[producerId])
          .map((id) => audioProducers.byId[id]);
        const consumersWithoutProducer = audioConsumers.allIds
          .map((id) => audioConsumers.byId[id])
          .filter((consumer) => !audioProducers.byId[consumer.producerId]);

        report('Add audio consumers');
        report(producersWithoutConsumer);
        producersWithoutConsumer.forEach((producer) => createConsumer(producer));
        report('Remove audio consumers');
        report(consumersWithoutProducer);
        consumersWithoutProducer.forEach((consumer) => removeConsumer(consumer, 'audio'));
      } else {
        report('remove ALL audio consumers');
        audioConsumers.allIds
          .map((id) => audioConsumers.byId[id])
          .forEach((consumer) => removeConsumer(consumer, 'audio'));
      }
    }
    return undefined;
  }, [ready, receiveAudio, audioConsumers, audioProducers, createConsumer, removeConsumer]);
  useEffect(() => {
    if (ready) {
      if (sendAudio) {
        getAudioTracks({ ...sendAudioOptions, sampleRate })
          .then((tracks) => shareAudio(tracks))
          .catch((error) => reportError(error));
        return () => stopSharingAudio();
      }
    }
    return undefined;
  }, [ready, sendAudio, sendAudioOptions, shareAudio, stopSharingAudio]);

  /** *
   * SYNC DEVICE
   */
  useEffect(() => {
    if (ready && localDevice) {
      setReceiveAudio((prev) => {
        if (prev !== localDevice.receiveAudio) {
          report('RECEIVE AUDIO CHANGED');
          return localDevice.receiveAudio;
        }
        return prev;
      });
      setReceiveVideo((prev) => {
        if (prev !== localDevice.receiveVideo) {
          report('RECEIVE VIDEO CHANGED');
          return localDevice.receiveVideo;
        }
        return prev;
      });
      setSendAudio((prev) => {
        if (prev !== localDevice.sendAudio) {
          report('SEND AUDIO CHANGED');
          return localDevice.sendAudio;
        }
        return prev;
      });
      setSendVideo((prev) => {
        if (prev !== localDevice.sendVideo) {
          report('SEND VIDEO CHANGED');
          return localDevice.sendVideo;
        }
        return prev;
      });
      setInputVideoDeviceId((prev) => {
        if (prev !== localDevice.inputVideoDeviceId) {
          report('SEND VIDEO DEVICE ID CHANGED');
          return localDevice.inputVideoDeviceId;
        }
        return prev;
      });
      setSendAudioOptions((prev) => {
        report('SEND AUDIO DEVICE CHANGED');
        if (
          (localDevice.inputAudioDeviceId !== undefined &&
            localDevice.inputAudioDeviceId !== prev.inputAudioDeviceId) ||
          (localDevice.echoCancellation !== undefined &&
            localDevice.echoCancellation !== prev.echoCancellation) ||
          (localDevice.autoGainControl !== undefined &&
            localDevice.autoGainControl !== prev.autoGainControl) ||
          (localDevice.noiseSuppression !== undefined &&
            localDevice.noiseSuppression !== prev.noiseSuppression)
        ) {
          return {
            inputAudioDeviceId: localDevice.inputAudioDeviceId || undefined,
            autoGainControl: localDevice.autoGainControl || false,
            echoCancellation: localDevice.echoCancellation || false,
            noiseSuppression: localDevice.noiseSuppression || false,
          };
        }
        return prev;
      });
    }
  }, [ready, localDevice]);

  return <>{children}</>;
};

MediasoupProvider.defaultProps = {
  standaloneRouterUrl: undefined,
  routerDistributorUrl: undefined,
};

const useMediasoup = undefined;

export { MediasoupProvider };
export default useMediasoup;
