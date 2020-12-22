import { TrackPreset } from './TrackPreset';

export interface TrackPresetCollection {
  byId: {
    [id: string]: TrackPreset;
  };
  bySoundCard: {
    [soundCardId: string]: string[];
  };
  allIds: string[];
}
