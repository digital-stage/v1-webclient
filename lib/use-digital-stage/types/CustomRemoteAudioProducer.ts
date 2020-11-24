import { ThreeDimensionAudioProperties } from './ThreeDimensionAudioProperty';

export interface CustomRemoteAudioProducer extends ThreeDimensionAudioProperties {
  _id: string;
  userId: string; // <-- RELATION
  stageMemberAudioProducerId: string; // <-- RELATION

  // Optimizations for performance
  stageId: string;
}
