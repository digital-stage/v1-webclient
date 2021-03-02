import { OvTrack } from './OvTrack';

export interface OvTrackCollection {
  byId: {
    [id: string]: OvTrack;
  };
  bySoundCard: {
    [soundCardId: string]: string[];
  };
  allIds: string[];
}
