/**
 * Each user can overwrite the global stage member track settings with personal preferences.
 */
import { ThreeDimensionAudioProperties } from './ThreeDimensionAudioProperty';

export interface CustomRemoteOvTrack extends ThreeDimensionAudioProperties {
  _id: string;

  userId: string; // <-- RELATION
  stageMemberOvTrackId: string; // <-- RELATION

  gain: number; // Overrides track gain (for user)

  directivity: 'omni' | 'cardioid'; // Overrides track directivity (for user)

  // Optimizations for performance
  stageId: string;
}
