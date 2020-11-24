import { ThreeDimensionAudioProperties } from './ThreeDimensionAudioProperty';

/**
 * A stage member is the associated between a user and a stage.
 * Settings can be only modified by admins.
 */
export interface StageMember extends ThreeDimensionAudioProperties {
  _id: string;
  groupId: string; // <--- RELATION
  userId: string; // <--- RELATION

  online: boolean;

  // SETTINGS (modifiable only by admins)
  isDirector: boolean;

  // Optimizations for performance
  stageId: string;
  // videoProducers: StageMemberVideoProducerId[];
  // audioProducers: StageMemberAudioProducerId[];
  // ovTracks: StageMemberOvTrackId[];
}
