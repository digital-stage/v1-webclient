import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents, ServerUserEvents } from '../../global/SocketEvents';
import { User, UsersCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../actions/stageActions';
import upsert from '../utils/upsert';

const addUser = (state: UsersCollection, user: User): UsersCollection => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [user._id]: user,
    },
    allIds: upsert<string>(state.allIds, user._id),
  };
};

function users(
  state: UsersCollection = {
    byId: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): UsersCollection {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        allIds: [],
      };
    }
    case ServerGlobalEvents.STAGE_JOINED: {
      const { users } = action.payload as InitialStagePackage;
      let updated = { ...state };
      if (users)
        users.forEach((user) => {
          updated = addUser(updated, user);
        });
      return updated;
    }
    case ServerStageEvents.REMOTE_USER_ADDED: {
      const user = action.payload as User;
      return addUser(state, user);
    }
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
      const user = action.payload as User;
      return {
        ...state,
        byId: {
          ...state.byId,
          [user._id]: user,
        },
        allIds: upsert<string>(state.allIds, user._id),
      };
    default:
      return state;
  }
}

export default users;
