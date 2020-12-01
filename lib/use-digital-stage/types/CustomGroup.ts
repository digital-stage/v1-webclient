/**
 * Each user can overwrite the global group settings with personal preferences
 */
import { ThreeDimensionAudioProperties } from './ThreeDimensionAudioProperty';

export interface CustomGroup extends ThreeDimensionAudioProperties {
  _id: string;
  userId: string; // <--- RELATION
  groupId: string; // <--- RELATION

  // Optimizations for performance
  stageId: string;
}
