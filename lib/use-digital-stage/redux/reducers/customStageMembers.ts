import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import { CustomStageMember, CustomStageMembersCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../actions/stageActions';
import upsert from '../utils/upsert';

const addCustomStageMember = (
  state: CustomStageMembersCollection,
  customStageMember: CustomStageMember
): CustomStageMembersCollection => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [customStageMember._id]: customStageMember,
    },
    byStageMember: {
      ...state.byStageMember,
      [customStageMember.stageMemberId]: customStageMember._id,
    },
    allIds: upsert<string>(state.allIds, customStageMember._id),
  };
};

function reduceCustomStageMembers(
  state: CustomStageMembersCollection = {
    byId: {},
    byStageMember: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): CustomStageMembersCollection {
  switch (action.type) {
    case ServerGlobalEvents.STAGE_LEFT:
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byStageMember: {},
        allIds: [],
      };
    }
    case ServerGlobalEvents.STAGE_JOINED: {
      const { customStageMembers } = action.payload as InitialStagePackage;
      let updatedState = { ...state };
      if (customStageMembers)
        customStageMembers.forEach((customStageMember) => {
          updatedState = addCustomStageMember(updatedState, customStageMember);
        });
      return updatedState;
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED: {
      const customStageMember = action.payload as CustomStageMember;
      return addCustomStageMember(state, customStageMember);
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED: {
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
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED: {
      const id = action.payload as string;
      if (state.byId[id]) {
        // TODO: Investigate the necessarity for this if
        const { stageMemberId } = state.byId[id];
        return {
          ...state,
          byId: omit(state.byId, id),
          byStageMember: omit(state.byStageMember, stageMemberId),
          allIds: without<string>(state.allIds, id),
        };
      }
      return state;
    }
    default:
      return state;
  }
}

export default reduceCustomStageMembers;
