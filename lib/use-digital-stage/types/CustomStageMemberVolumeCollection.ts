import { CustomStageMemberVolume } from './CustomStageMemberVolume';

export interface CustomStageMemberVolumeCollection {
  byId: {
    [id: string]: CustomStageMemberVolume;
  };
  byStageMember: {
    [stageMemberId: string]: string;
  };
  allIds: string[];
}
