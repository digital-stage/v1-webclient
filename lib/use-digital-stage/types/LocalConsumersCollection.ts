import { LocalConsumer } from './LocalConsumer';

export interface LocalConsumersCollection {
  byId: {
    [id: string]: LocalConsumer;
  };
  byStageMember: {
    [stageMemberId: string]: string[];
  };
  byProducer: {
    [producerId: string]: string;
  };
  allIds: string[];
}
