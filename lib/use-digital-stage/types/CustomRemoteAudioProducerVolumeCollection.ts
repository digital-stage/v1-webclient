import { CustomRemoteAudioProducerVolume } from './CustomRemoteAudioProducerVolume';

export interface CustomRemoteAudioProducerVolumeCollection {
  byId: {
    [id: string]: CustomRemoteAudioProducerVolume;
  };
  byAudioProducer: {
    [audioProducerId: string]: string;
  };
  allIds: string[];
}
