import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerStageEvents } from '../../global/SocketEvents';
import { RemoteAudioProducer, RemoteAudioProducersCollection } from '../../types';

function audioProducers(
  state: RemoteAudioProducersCollection = {
    byId: {},
    byStageMember: {},
    byStage: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): RemoteAudioProducersCollection {
  switch (action.type) {
    case ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED: {
      const audioProducer = action.payload as RemoteAudioProducer;
      return {
        ...state,
        byId: {
          ...state.byId,
          [audioProducer._id]: audioProducer,
        },
        byStageMember: {
          ...state.byStageMember,
          [audioProducer.stageMemberId]: state.byStageMember[audioProducer.stageMemberId]
            ? [...state.byStageMember[audioProducer.stageMemberId], audioProducer._id]
            : [audioProducer._id],
        },
        byStage: {
          ...state.byStage,
          [audioProducer.stageId]: state.byStage[audioProducer.stageId]
            ? [...state.byStage[audioProducer.stageId], audioProducer._id]
            : [audioProducer._id],
        },
        allIds: [...state.allIds, audioProducer._id],
      };
    }
    case ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED: {
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
    case ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED: {
      const id = action.payload as string;
      if (!state.byId[id]) {
        return state;
      }
      const { stageId, stageMemberId } = state.byId[id];
      return {
        ...state,
        byId: omit(state.byId, id),
        byStageMember: {
          ...state.byStageMember,
          [stageMemberId]: without(state.byStageMember[stageMemberId], id),
        },
        byStage: {
          ...state.byStage,
          [stageId]: without(state.byStage[stageId], id),
        },
        allIds: without<string>(state.allIds, id),
      };
    }
    default:
      return state;
  }
}

export default audioProducers;
