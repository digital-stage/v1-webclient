import omit from 'lodash/omit';
import without from 'lodash/without';
import {  ServerStageEvents } from '../../global/SocketEvents';
import {CustomStageMemberPosition, CustomStageMemberPositionCollection} from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../../types/InitialStagePackage';
import upsert from '../utils/upsert';

const addCustomStageMemberPosition = (
  state: CustomStageMemberPositionCollection,
  customStageMember: CustomStageMemberPosition
): CustomStageMemberPositionCollection => {
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

function reduceCustomStageMemberPositions(
  state: CustomStageMemberPositionCollection = {
    byId: {},
    byStageMember: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): CustomStageMemberPositionCollection {
  switch (action.type) {
    case ServerStageEvents.STAGE_LEFT:
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byStageMember: {},
        allIds: [],
      };
    }
    case ServerStageEvents.STAGE_JOINED: {
      const { customStageMemberPositions } = action.payload as InitialStagePackage;
      let updatedState = { ...state };
      if (customStageMemberPositions)
        customStageMemberPositions.forEach((customStageMember) => {
          updatedState = addCustomStageMemberPosition(updatedState, customStageMember);
        });
      return updatedState;
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_POSITION_ADDED: {
      const customStageMember = action.payload as CustomStageMemberPosition;
      return addCustomStageMemberPosition(state, customStageMember);
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_POSITION_CHANGED: {
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
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_POSITION_REMOVED: {
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

export default reduceCustomStageMemberPositions;
