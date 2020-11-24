import { RemoteVideoProducer } from './RemoteVideoProducer';

export interface RemoteVideoProducersCollection {
  byId: {
    [id: string]: RemoteVideoProducer;
  };
  byStageMember: {
    [stageMemberId: string]: string[];
  };
  byStage: {
    [stageId: string]: string[];
  };
  allIds: string[];
}
