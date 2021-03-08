import { CustomGroupPosition } from './CustomGroupPosition';

export interface CustomGroupPositionCollection {
  byId: {
    [id: string]: CustomGroupPosition;
  };
  byGroup: {
    [groupId: string]: string;
  };
  allIds: string[];
}
