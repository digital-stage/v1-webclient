import { RemoteAudioProducer } from './RemoteAudioProducer';

export interface RemoteAudioProducersCollection {
  byId: {
    [id: string]: RemoteAudioProducer;
  };
  byStageMember: {
    [stageMemberId: string]: string[];
  };
  byStage: {
    [stageId: string]: string[];
  };
  allIds: string[];
}
