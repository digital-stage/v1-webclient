/**
 * A track is always assigned to a specific stage member and channel of an sound card.
 *
 */
export interface Track {
  _id: string;
  trackPresetId: string; // <--- RELATION
  channel: number; // UNIQUE WITH TRACK PRESET ID

  online: boolean;

  gain: number;
  volume: number;

  directivity: 'omni' | 'cardioid';

  // Optimizations for performance
  userId: string;
  soundCardId: string;
}
