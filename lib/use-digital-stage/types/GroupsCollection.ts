import { Group } from './Group';

export interface GroupsCollection {
  byId: {
    [id: string]: Group;
  };
  byStage: {
    [stageId: string]: string[];
  };
  allIds: string[];
}
