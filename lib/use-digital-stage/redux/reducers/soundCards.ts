import omit from 'lodash/omit';
import upsert from '../utils/upsert';
import { ServerDeviceEvents } from '../../global/SocketEvents';
import { SoundCard } from '../../types';
import { SoundCardCollection } from '../../types/SoundCardCollection';

export type SoundCardAction =
  | { type: ServerDeviceEvents.SOUND_CARD_ADDED; payload: SoundCard }
  | { type: ServerDeviceEvents.SOUND_CARD_CHANGED; payload: SoundCard }
  | { type: ServerDeviceEvents.SOUND_CARD_REMOVED; payload: string };

function soundCards(
  state: SoundCardCollection = {
    byId: {},
    allIds: [],
  },
  action: SoundCardAction
): SoundCardCollection {
  switch (action.type) {
    case ServerDeviceEvents.SOUND_CARD_ADDED: {
      const soundCard: SoundCard = action.payload;
      return {
        byId: {
          ...state.byId,
          [soundCard._id]: soundCard,
        },
        allIds: upsert<string>(state.allIds, soundCard._id),
      };
    }
    case ServerDeviceEvents.SOUND_CARD_CHANGED: {
      const soundCard: SoundCard = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [soundCard._id]: {
            ...state.byId[soundCard._id],
            ...soundCard,
          },
        },
      };
    }
    case ServerDeviceEvents.SOUND_CARD_REMOVED: {
      const removedId: string = action.payload;
      return {
        ...state,
        byId: omit(state.byId, removedId),
        allIds: state.allIds.filter((id) => id !== removedId),
      };
    }
    default:
      return state;
  }
}

export default soundCards;
