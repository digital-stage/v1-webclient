import { StageMember } from './StageMember';

export interface StageMembersCollection {
  byId: {
    [id: string]: StageMember;
  };
  byGroup: {
    [groupId: string]: string[];
  };
  byStage: {
    [stageId: string]: string[];
  };
  allIds: string[];
}
