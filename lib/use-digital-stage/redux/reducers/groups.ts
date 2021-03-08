import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import upsert from '../utils/upsert';
import { Group, GroupsCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../../types/InitialStagePackage';

const addGroup = (state: GroupsCollection, group: Group): GroupsCollection => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [group._id]: group,
    },
    byStage: {
      ...state.byStage,
      [group.stageId]: upsert<string>(state.byStage[group.stageId], group._id),
    },
    allIds: upsert<string>(state.allIds, group._id),
  };
};

function reduceGroups(
  prev: GroupsCollection = {
    byId: {},
    byStage: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): GroupsCollection {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byStage: {},
        allIds: [],
      };
    }
    case ServerStageEvents.STAGE_JOINED: {
      const { groups } = action.payload as InitialStagePackage;
      let state = { ...prev };
      if (groups)
        groups.forEach((group) => {
          state = addGroup(state, group);
        });
      return state;
    }
    case ServerStageEvents.GROUP_ADDED: {
      const group = action.payload as Group;
      return addGroup(prev, group);
    }
    case ServerStageEvents.GROUP_CHANGED:
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [action.payload._id]: {
            ...prev.byId[action.payload._id],
            ...action.payload,
          },
        },
      };
    case ServerStageEvents.GROUP_REMOVED: {
      const id = action.payload as string;
      const { stageId } = prev.byId[id];
      return {
        ...prev,
        byId: omit(prev.byId, action.payload),
        byStage: {
          ...prev.byStage,
          [stageId]: without<string>(prev.byStage[stageId], id),
        },
        allIds: without<string>(prev.allIds, action.payload),
      };
    }
    default:
      return prev;
  }
}

export default reduceGroups;
