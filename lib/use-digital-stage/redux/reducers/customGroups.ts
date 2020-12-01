import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import { CustomGroup, CustomGroupsCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../actions/stageActions';
import upsert from '../utils/upsert';

const addCustomGroup = (
  state: CustomGroupsCollection,
  customGroup: CustomGroup
): CustomGroupsCollection => {
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
    allIds: upsert<string>(state.allIds, customGroup._id),
  };
};

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
    case ServerGlobalEvents.STAGE_JOINED: {
      const { customGroups } = action.payload as InitialStagePackage;
      let updatedState = { ...state };
      if (customGroups)
        customGroups.forEach((customGroup) => {
          updatedState = addCustomGroup(updatedState, customGroup);
        });
      return updatedState;
    }
    case ServerStageEvents.CUSTOM_GROUP_ADDED: {
      const customGroup = action.payload as CustomGroup;
      return addCustomGroup(state, customGroup);
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
