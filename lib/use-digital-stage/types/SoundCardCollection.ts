import { SoundCard } from './SoundCard';

export interface SoundCardCollection {
  byId: {
    [id: string]: SoundCard;
  };
  allIds: string[];
}
