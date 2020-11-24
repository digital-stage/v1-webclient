import { CustomStageMember } from './CustomStageMember';

export interface CustomStageMembersCollection {
  byId: {
    [id: string]: CustomStageMember;
  };
  byStageMember: {
    [stageMemberId: string]: string;
  };
  allIds: string[];
}
