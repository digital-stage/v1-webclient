import { Track } from './Track';

export interface TrackCollection {
  byId: {
    [id: string]: Track;
  };
  bySoundCard: {
    [soundCardId: string]: string[];
  };
  byPreset: {
    [trackPresetId: string]: string[];
  };
  allIds: string[];
}
