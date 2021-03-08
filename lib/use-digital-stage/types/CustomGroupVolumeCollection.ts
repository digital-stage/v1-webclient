import { CustomGroupVolume } from './CustomGroupVolume';

export interface CustomGroupVolumeCollection {
  byId: {
    [id: string]: CustomGroupVolume;
  };
  byGroup: {
    [groupId: string]: string;
  };
  allIds: string[];
}
