import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerStageEvents } from '../../global/SocketEvents';
import { CustomGroup, CustomGroupsCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';

function customGroups(
  state: CustomGroupsCollection = {
    byId: {},
    byGroup: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): CustomGroupsCollection {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byGroup: {},
        allIds: [],
      };
    }
    case ServerStageEvents.CUSTOM_GROUP_ADDED: {
      const customGroup = action.payload as CustomGroup;
      return {
        ...state,
        byId: {
          ...state.byId,
          [customGroup._id]: customGroup,
        },
        byGroup: {
          ...state.byGroup,
          [customGroup.groupId]: customGroup._id,
        },
        allIds: [...state.allIds, customGroup._id],
      };
    }
    case ServerStageEvents.CUSTOM_GROUP_CHANGED: {
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
    }
    case ServerStageEvents.CUSTOM_GROUP_REMOVED: {
      const id = action.payload as string;
      if (state.byId[id]) {
        // TODO: Why is the line above necessary?
        const { groupId } = state.byId[id];
        return {
          ...state,
          byId: omit(state.byId, id),
          byGroup: omit(state.byGroup, groupId),
          allIds: without<string>(state.allIds, id),
        };
      }
      return state;
    }
    default:
      return state;
  }
}

export default customGroups;
