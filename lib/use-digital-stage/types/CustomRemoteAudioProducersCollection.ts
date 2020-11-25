import { CustomRemoteAudioProducer } from './CustomRemoteAudioProducer';

export interface CustomRemoteAudioProducersCollection {
  byId: {
    [id: string]: CustomRemoteAudioProducer;
  };
  byAudioProducer: {
    [audioProducerId: string]: string;
  };
  allIds: string[];
}
