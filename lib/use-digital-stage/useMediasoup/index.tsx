import React, { useCallback, useEffect, useState } from 'react';
import debug from 'debug';
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

const d = debug('useMediasoup');
const trace = d.extend('info');
const err = d.extend('err');

const debugEffect = debug('useEffect:useMediasoup');

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
  // const [working, setWorking] = useState<boolean>(false);
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

  const [localVideoProducers, setLocalVideoProducers] = useState<LocalProducer[]>([]);
  const [localAudioProducers, setLocalAudioProducers] = useState<LocalProducer[]>([]);

  const getVideoTracks = useCallback((): Promise<MediaStreamTrack[]> => {
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

  const getAudioTracks = useCallback((): Promise<MediaStreamTrack[]> => {
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

  const createConsumer = useCallback(
    (producer: RemoteVideoProducer | RemoteAudioProducer): Promise<void> => {
      return consume(producer).then((consumer) => {
        if (isAudioProducer(producer)) {
          dispatch(allActions.stageActions.client.addAudioConsumer(consumer));
        } else {
          dispatch(allActions.stageActions.client.addVideoConsumer(consumer));
        }
        return undefined;
      });
    },
    [consume, dispatch]
  );

  const removeConsumer = useCallback(
    (consumer: LocalConsumer, type: 'audio' | 'video'): Promise<void> => {
      return stopConsuming(consumer)
        .then(() => undefined)
        .finally(() => {
          if (type === 'video') {
            dispatch(allActions.stageActions.client.removeVideoConsumer(consumer._id));
          } else {
            dispatch(allActions.stageActions.client.removeAudioConsumer(consumer._id));
          }
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
      producersWithoutConsumer.map((producer) =>
        createConsumer(producer).catch((error) => err(error))
      ),
      consumersWithoutProducer.map((consumer) =>
        removeConsumer(consumer, 'video').catch((error) => err(error))
      ),
    ]);
  }, [videoProducers, videoConsumers, createConsumer, removeConsumer]);
  const removeAllVideoConsumers = useCallback(() => {
    return Promise.all(
      videoConsumers.allIds
        .map((id) => videoConsumers.byId[id])
        .map((consumer) => removeConsumer(consumer, 'video'))
    );
  }, [videoConsumers, removeConsumer]);
  const shareVideo = useCallback(() => {
    return getVideoTracks()
      .then((tracks) => Promise.all(tracks.map((track) => produce(track))))
      .then((localProducers) => setLocalVideoProducers((prev) => [...prev, ...localProducers]));
  }, [getVideoTracks, produce]);
  const stopSharingVideo = useCallback(() => {
    return Promise.all(
      localVideoProducers.map((localProducer) => stopProducing(localProducer))
    ).finally(() => setLocalVideoProducers([]));
  }, [localVideoProducers, stopProducing]);
  useEffect(() => {
    if (ready) {
      debugEffect('ready receiveVideo');
      if (receiveVideo) {
        consumeAllVideos().catch((error) => err(error));
      } else {
        removeAllVideoConsumers().catch((error) => err(error));
      }
    }
  }, [ready, receiveVideo]);
  useEffect(() => {
    if (ready) {
      debugEffect('ready videoProducers');
      if (receiveVideo) {
        refreshVideoConsumers().catch((error) => err(error));
      }
    }
  }, [ready, videoProducers]);
  useEffect(() => {
    if (ready) {
      debugEffect('ready sendVideo');
      if (sendVideo) {
        shareVideo().catch((error) => err(error));
      } else {
        stopSharingVideo().catch((error) => err(error));
      }
    }
  }, [ready, sendVideo, shareVideo]);

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
      producersWithoutConsumer.map((producer) =>
        createConsumer(producer).catch((error) => err(error))
      ),
      consumersWithoutProducer.map((consumer) =>
        removeConsumer(consumer, 'audio').catch((error) => err(error))
      ),
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
    () =>
      getAudioTracks()
        .then((tracks) => Promise.all(tracks.map((track) => produce(track))))
        .then((localProducers) => setLocalAudioProducers((prev) => [...prev, ...localProducers])),
    [getAudioTracks, produce]
  );
  const stopSharingAudio = useCallback(() => {
    return Promise.all(
      localAudioProducers.map((localProducer) => stopProducing(localProducer))
    ).finally(() => setLocalAudioProducers([]));
  }, [localAudioProducers, stopProducing]);
  useEffect(() => {
    if (ready) {
      if (receiveAudio) {
        consumeAllAudio().catch((error) => err(error));
      } else {
        removeAllAudioConsumers().catch((error) => err(error));
      }
    }
    return undefined;
  }, [ready, receiveAudio]);
  useEffect(() => {
    if (ready) {
      if (receiveAudio) {
        refreshAudioConsumers().catch((error) => err(error));
      }
    }
    return undefined;
  }, [ready, audioProducers]);
  useEffect(() => {
    if (ready) {
      if (sendAudio) {
        shareAudio().catch((error) => err(error));
      } else {
        stopSharingAudio().catch((error) => err(error));
      }
    }
  }, [ready, sendAudio, shareAudio]);

  /** *
   * SYNC DEVICE
   */
  useEffect(() => {
    if (ready && localDevice) {
      if (localDevice.receiveAudio !== receiveAudio) {
        trace('RECEIVE AUDIO CHANGED');
        setReceiveAudio(localDevice.receiveAudio);
      }
      if (localDevice.receiveVideo !== receiveVideo) {
        trace('RECEIVE VIDEO CHANGED');
        setReceiveVideo(localDevice.receiveVideo);
      }
      if (localDevice.sendAudio !== sendAudio) {
        trace('SEND AUDIO CHANGED');
        setSendAudio(localDevice.sendAudio);
      }
      if (localDevice.sendVideo !== sendVideo) {
        trace('SEND VIDEO CHANGED');
        setSendVideo(localDevice.sendVideo);
      }
      if (localDevice.inputAudioDeviceId !== inputAudioDeviceId) {
        trace('SEND AUDIO DEVICE ID CHANGED');
        setInputAudioDeviceId(localDevice.inputAudioDeviceId);
      }
      if (localDevice.inputVideoDeviceId !== inputVideoDeviceId) {
        trace('SEND VIDEO DEVICE ID CHANGED');
        setInputVideoDeviceId(localDevice.inputVideoDeviceId);
      }
    }
  }, [ready, localDevice]);
  useEffect(() => {
    trace('MEDIASOUP CHANGED');
  }, [ready]);

  return <>{children}</>;
};

const useMediasoup = undefined;

export { MediasoupProvider };
export default useMediasoup;
