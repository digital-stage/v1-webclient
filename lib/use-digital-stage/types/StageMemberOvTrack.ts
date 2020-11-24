/**
 * A stage member track is a track,
 * that has been published and assigned to the related stage member.
 * So all other stage members will receive this track.
 *
 * Important: a track can point to an ov-based track or an webrtc-based producer (!)
 *
 * However, spatial audio settings are stored for both,
 * maybe for integrating webrtc and ov later and use
 * the web audio api panner for 3D audio interpolation later.
 */
import { ThreeDimensionAudioProperties } from './ThreeDimensionAudioProperty';
import { Track } from './Track';

export interface StageMemberOvTrack extends Track, ThreeDimensionAudioProperties {
  _id: string;
  trackId: string; // <-- RELATION
  stageMemberId: string; // <-- RELATION

  online: boolean;

  gain: number; // Overrides track gain (for stage)

  directivity: 'omni' | 'cardioid'; // Overrides track directivity (for stage)

  // Optimizations for performance
  userId: string;
  stageId: string;
}
