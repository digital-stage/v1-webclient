import omit from 'lodash/omit';
import filter from 'lodash/filter';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import upsert from '../utils/upsert';
import { StageMember, StageMembersCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../actions/stageActions';

const addStageMember = (
  prev: StageMembersCollection,
  stageMember: StageMember
): StageMembersCollection => {
  return {
    ...prev,
    byId: {
      ...prev.byId,
      [stageMember._id]: stageMember,
    },
    byStage: {
      ...prev.byStage,
      [stageMember.stageId]: upsert<string>(prev.byStage[stageMember.stageId], stageMember._id),
    },
    byGroup: {
      ...prev.byGroup,
      [stageMember.groupId]: upsert<string>(prev.byGroup[stageMember.groupId], stageMember._id),
    },
    allIds: upsert<string>(prev.allIds, stageMember._id),
  };
};

function reduceStageMembers(
  prev: StageMembersCollection = {
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
    case ServerGlobalEvents.STAGE_LEFT:
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byStage: {},
        byGroup: {},
        allIds: [],
      };
    }
    case ServerGlobalEvents.STAGE_JOINED: {
      const { stageMembers } = action.payload as InitialStagePackage;
      let state = { ...prev };
      if (stageMembers)
        stageMembers.forEach((stageMember) => {
          state = addStageMember(state, stageMember);
        });
      return state;
    }
    case ServerStageEvents.STAGE_MEMBER_ADDED: {
      const stageMember = action.payload as StageMember;
      return addStageMember(prev, stageMember);
    }
    case ServerStageEvents.STAGE_MEMBER_CHANGED: {
      const modifiedprev = { ...prev };
      if (action.payload.groupId) {
        // Group has changed
        const oldGroupId = prev.byId[action.payload._id].groupId;
        // Remove old byGroup entry
        modifiedprev.byGroup[oldGroupId] = filter(prev.byGroup[oldGroupId], action.payload._id);
        // Add new byGroup
        modifiedprev.byGroup[action.payload.groupId] = upsert<string>(
          prev.byGroup[action.payload.groupId],
          action.payload._id
        );
      }
      return {
        ...modifiedprev,
        byId: {
          ...prev.byId,
          [action.payload._id]: {
            ...prev.byId[action.payload._id],
            ...action.payload,
          },
        },
      };
    }
    case ServerStageEvents.STAGE_MEMBER_REMOVED: {
      const id = action.payload as string;
      const { stageId } = prev.byId[id];
      const { groupId } = prev.byId[id];
      return {
        ...prev,
        byId: omit(prev.byId, id),
        byStage: {
          ...prev.byStage,
          [stageId]: without<string>(prev.byStage[stageId], action.payload),
        },
        byGroup: {
          ...prev.byGroup,
          [groupId]: without<string>(prev.byGroup[groupId], action.payload),
        },
        allIds: without<string>(prev.allIds, id),
      };
    }
    default:
      return prev;
  }
}

export default reduceStageMembers;