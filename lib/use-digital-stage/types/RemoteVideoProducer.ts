export interface RemoteVideoProducer {
  _id: string;
  stageMemberId: string; // <-- RELATION
  globalProducerId: string; // <-- RELATION

  online: boolean;

  // Optimizations for performance
  userId: string;
  stageId: string;
}
