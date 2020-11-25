import { CustomGroup } from './CustomGroup';

export interface CustomGroupsCollection {
  byId: {
    [id: string]: CustomGroup;
  };
  byGroup: {
    [groupId: string]: string;
  };
  allIds: string[];
}
