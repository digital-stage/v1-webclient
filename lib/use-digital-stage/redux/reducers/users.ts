import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerStageEvents, ServerUserEvents } from '../../global/SocketEvents';
import { UsersCollection } from '../../types';

function users(
  state: UsersCollection = {
    byId: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case ServerStageEvents.REMOTE_USER_ADDED:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: action.payload,
        },
        allIds: [...state.allIds, action.payload._id],
      };
    case ServerUserEvents.USER_CHANGED:
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
    case ServerStageEvents.REMOTE_USER_CHANGED:
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
    case ServerStageEvents.REMOTE_USER_REMOVED:
      return {
        ...state,
        byId: omit(state.byId, action.payload),
        allIds: without<string>(state.allIds, action.payload),
      };
    case ServerUserEvents.USER_READY:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: action.payload,
        },
        allIds: [...state.allIds, action.payload._id],
      };
    default:
      return state;
  }
}

export default users;
