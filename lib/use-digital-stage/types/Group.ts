import { ThreeDimensionAudioProperties } from './ThreeDimensionAudioProperty';

/**
 * A group can be only modified by admins
 */
export interface Group extends ThreeDimensionAudioProperties {
  _id: string;
  name: string;
  stageId: string; // <--- RELATION
}
