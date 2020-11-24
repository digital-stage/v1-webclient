import { User } from './User';

export interface UsersCollection {
  byId: {
    [id: string]: User;
  };
  allIds: string[];
}
