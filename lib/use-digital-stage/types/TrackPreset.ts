/**
 * A preset for channels / track configuration
 */
export interface TrackPreset {
  _id: string;
  userId: string; // <--- RELATION
  soundCardId: string; // <--- RELATION
  name: string;
  outputChannels: number[]; // For the output use simple numbers TODO: @Giso, is this enough?

  // Optimization
  // trackIds: TrackId[];
}
