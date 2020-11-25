import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerStageEvents } from '../../global/SocketEvents';
import { StagesCollection } from '../../types';

function stages(
  state: StagesCollection = {
    byId: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case ServerStageEvents.STAGE_ADDED:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: action.payload,
        },
        allIds: [...state.allIds, action.payload._id],
      };
    case ServerStageEvents.STAGE_CHANGED:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: {
            ...state.byId[action.payload._id],
            ...action.payload,
          },
        },
      };
    case ServerStageEvents.STAGE_REMOVED:
      return {
        ...state,
        byId: omit(state.byId, action.payload),
        allIds: without<string>(state.allIds, action.payload),
      };
    default:
      return state;
  }
}

export default stages;
