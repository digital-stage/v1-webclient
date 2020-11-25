import omit from 'lodash/omit';
import filter from 'lodash/filter';
import without from 'lodash/without';
import { ServerStageEvents } from '../../global/SocketEvents';
import upsert from '../utils/upsert';
import { StageMembersCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';

function stageMembers(
  state: StageMembersCollection = {
    byId: {},
    byStage: {},
    byGroup: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): StageMembersCollection {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byStage: {},
        byGroup: {},
        allIds: [],
      };
    }
    case ServerStageEvents.STAGE_MEMBER_ADDED:
      return {
        ...state,
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: action.payload,
        },
        byStage: {
          ...state.byStage,
          [action.payload.stageId]: upsert<string>(
            state.byStage[action.payload.stageId],
            action.payload._id
          ),
        },
        byGroup: {
          ...state.byGroup,
          [action.payload.groupId]: upsert<string>(
            state.byStage[action.payload.groupId],
            action.payload._id
          ),
        },
        allIds: [...state.allIds, action.payload._id],
      };
    case ServerStageEvents.STAGE_MEMBER_CHANGED: {
      const modifiedState = { ...state };
      if (action.payload.groupId) {
        // Group has changed
        const oldGroupId = state.byId[action.payload._id].groupId;
        // Remove old byGroup entry
        modifiedState.byGroup[oldGroupId] = filter(state.byGroup[oldGroupId], action.payload._id);
        // Add new byGroup
        modifiedState.byGroup[action.payload.groupId] = upsert<string>(
          state.byGroup[action.payload.groupId],
          action.payload._id
        );
      }
      return {
        ...modifiedState,
        byId: {
          ...state.byId,
          [action.payload._id]: {
            ...state.byId[action.payload._id],
            ...action.payload,
          },
        },
      };
    }
    case ServerStageEvents.STAGE_MEMBER_REMOVED: {
      const id = action.payload as string;
      const { stageId } = state.byId[id];
      const { groupId } = state.byId[id];
      return {
        ...state,
        byId: omit(state.byId, id),
        byStage: {
          ...state.byStage,
          [stageId]: without<string>(state.byStage[stageId], action.payload),
        },
        byGroup: {
          ...state.byGroup,
          [groupId]: without<string>(state.byGroup[groupId], action.payload),
        },
        allIds: without<string>(state.allIds, id),
      };
    }
    default:
      return state;
  }
}

export default stageMembers;
