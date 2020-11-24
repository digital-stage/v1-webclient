import { ThreeDimensionAudioProperties } from './ThreeDimensionAudioProperty';

export interface CustomStageMember extends ThreeDimensionAudioProperties {
  _id: string;
  userId: string; // <--- RELATION
  stageMemberId: string; // <--- RELATION

  // Optimizations for performance
  stageId: string;
}
