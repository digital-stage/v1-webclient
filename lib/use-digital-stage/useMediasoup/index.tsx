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
  routerDistUrl: string;
}): JSX.Element => {
  const { children, routerDistUrl } = props;
  const dispatch = useDispatch();

  // Local device handling
  const localDevice = useLocalDevice();
  const [sendAudio, setSendAudio] = useState<boolean>(false);
  const [sendVideo, setSendVideo] = useState<boolean>(false);
  const [receiveVideo, setReceiveVideo] = useState<boolean>(false);
  const [receiveAudio, setReceiveAudio] = useState<boolean>(false);
  const [inputVideoDeviceId, setInputVideoDeviceId] = useState<string>();
  const [inputAudioDeviceId, setInputAudioDeviceId] = useState<string>();

  const { ready, consume, produce, stopProducing, stopConsuming } = useMediasoupTransport(
    routerDistUrl
  );

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
  const consumeAllVideos = useCallback(() => {
    return Promise.all(
      videoProducers.allIds
        .map((id) => videoProducers.byId[id])
        .map((producer) => createConsumer(producer))
    );
  }, [videoProducers, createConsumer]);
  const refreshVideoConsumers = useCallback(() => {
    const producersWithoutConsumer = videoProducers.allIds
      .filter((producerId) => !videoConsumers.byProducer[producerId])
      .map((id) => videoProducers.byId[id]);
    const consumersWithoutProducer = videoConsumers.allIds
      .map((id) => videoConsumers.byId[id])
      .filter((consumer) => !videoProducers.byId[consumer.producerId]);
    return Promise.all([
      producersWithoutConsumer.map((producer) => createConsumer(producer)),
      consumersWithoutProducer.map((consumer) => removeConsumer(consumer, 'video')),
    ]);
  }, [videoProducers, videoConsumers, createConsumer, removeConsumer]);
  const removeAllVideoConsumers = useCallback(() => {
    return Promise.all(
      videoConsumers.allIds
        .map((id) => videoConsumers.byId[id])
        .map((consumer) => removeConsumer(consumer, 'video'))
    );
  }, [videoConsumers, removeConsumer]);
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
      reportEffect('ready receiveVideo');
      if (receiveVideo) {
        consumeAllVideos().catch((error) => reportError(error));
      } else {
        removeAllVideoConsumers().catch((error) => reportError(error));
      }
    }
  }, [ready, receiveVideo]);
  useEffect(() => {
    if (ready) {
      reportEffect('ready videoProducers');
      if (receiveVideo) {
        refreshVideoConsumers().catch((error) => reportError(error));
      }
    }
  }, [ready, videoProducers]);
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
  const consumeAllAudio = useCallback(() => {
    return Promise.all(
      audioProducers.allIds
        .map((id) => audioProducers.byId[id])
        .map((producer) => createConsumer(producer))
    );
  }, [audioProducers, createConsumer]);
  const refreshAudioConsumers = useCallback(() => {
    const producersWithoutConsumer = audioProducers.allIds
      .filter((producerId) => !audioConsumers.byProducer[producerId])
      .map((id) => audioProducers.byId[id]);
    const consumersWithoutProducer = audioConsumers.allIds
      .map((id) => audioConsumers.byId[id])
      .filter((consumer) => !audioProducers.byId[consumer.producerId]);
    return Promise.all([
      producersWithoutConsumer.map((producer) => createConsumer(producer)),
      consumersWithoutProducer.map((consumer) => removeConsumer(consumer, 'audio')),
    ]);
  }, [audioProducers, audioConsumers, createConsumer, removeConsumer]);
  const removeAllAudioConsumers = useCallback(() => {
    return Promise.all(
      audioConsumers.allIds
        .map((id) => audioConsumers.byId[id])
        .map((consumer) => removeConsumer(consumer, 'audio'))
    );
  }, [audioConsumers, removeConsumer]);
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
        consumeAllAudio().catch((error) => reportError(error));
      } else {
        removeAllAudioConsumers().catch((error) => reportError(error));
      }
    }
    return undefined;
  }, [ready, receiveAudio]);
  useEffect(() => {
    if (ready) {
      if (receiveAudio) {
        refreshAudioConsumers().catch((error) => reportError(error));
      }
    }
    return undefined;
  }, [ready, audioProducers]);
  useEffect(() => {
    if (ready) {
      if (sendAudio) {
        getAudioTracks(inputAudioDeviceId)
          .then((tracks) => shareAudio(tracks))
          .catch((error) => reportError(error));
        return () => stopSharingAudio();
      }
    }
    return undefined;
  }, [ready, sendAudio, inputAudioDeviceId, shareAudio, stopSharingAudio]);

  /** *
   * SYNC DEVICE
   */
  useEffect(() => {
    if (ready && localDevice) {
      if (localDevice.receiveAudio !== receiveAudio) {
        report('RECEIVE AUDIO CHANGED');
        setReceiveAudio(localDevice.receiveAudio);
      }
      if (localDevice.receiveVideo !== receiveVideo) {
        report('RECEIVE VIDEO CHANGED');
        setReceiveVideo(localDevice.receiveVideo);
      }
      if (localDevice.sendAudio !== sendAudio) {
        report('SEND AUDIO CHANGED');
        setSendAudio(localDevice.sendAudio);
      }
      if (localDevice.sendVideo !== sendVideo) {
        report('SEND VIDEO CHANGED');
        setSendVideo(localDevice.sendVideo);
      }
      if (localDevice.inputAudioDeviceId !== inputAudioDeviceId) {
        report('SEND AUDIO DEVICE ID CHANGED');
        setInputAudioDeviceId(localDevice.inputAudioDeviceId);
      }
      if (localDevice.inputVideoDeviceId !== inputVideoDeviceId) {
        report('SEND VIDEO DEVICE ID CHANGED');
        setInputVideoDeviceId(localDevice.inputVideoDeviceId);
      }
    }
  }, [ready, localDevice]);
  useEffect(() => {
    report('MEDIASOUP CHANGED');
  }, [ready]);

  return <>{children}</>;
};

const useMediasoup = undefined;

export { MediasoupProvider };
export default useMediasoup;
