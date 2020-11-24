import { Device } from './Device';

export interface DevicesCollection {
  byId: {
    [id: string]: Device;
  };
  allIds: string[];
}
