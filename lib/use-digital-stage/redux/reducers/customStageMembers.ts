import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerStageEvents } from '../../global/SocketEvents';
import { CustomStageMember, CustomStageMembersCollection } from '../../types';

function customStageMembers(
  state: CustomStageMembersCollection = {
    byId: {},
    byStageMember: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED: {
      const customStageMember = action.payload as CustomStageMember;
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
        allIds: [...state.allIds, customStageMember._id],
      };
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
      const { stageMemberId } = state.byId[id];
      return {
        ...state,
        byId: omit(state.byId, id),
        byStageMember: omit(state.byStageMember, stageMemberId),
        allIds: without<string>(state.allIds, id),
      };
    }
    default:
      return state;
  }
}

export default customStageMembers;
