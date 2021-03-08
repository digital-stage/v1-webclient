import { CustomRemoteAudioProducerPosition } from './CustomRemoteAudioProducerPosition';

export interface CustomRemoteAudioProducerPositionCollection {
  byId: {
    [id: string]: CustomRemoteAudioProducerPosition;
  };
  byAudioProducer: {
    [audioProducerId: string]: string;
  };
  allIds: string[];
}
