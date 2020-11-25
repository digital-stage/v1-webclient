import { Stage } from './Stage';

export interface StagesCollection {
  byId: {
    [id: string]: Stage;
  };
  allIds: string[];
}
