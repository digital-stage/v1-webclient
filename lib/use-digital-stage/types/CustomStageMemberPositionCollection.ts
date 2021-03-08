import { CustomStageMemberPosition } from './CustomStageMemberPosition';

export interface CustomStageMemberPositionCollection {
  byId: {
    [id: string]: CustomStageMemberPosition;
  };
  byStageMember: {
    [stageMemberId: string]: string;
  };
  allIds: string[];
}
