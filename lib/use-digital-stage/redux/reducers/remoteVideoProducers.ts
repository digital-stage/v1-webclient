import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import { RemoteVideoProducer, RemoteVideoProducersCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../../types/InitialStagePackage';
import upsert from '../utils/upsert';

const addVideoProducer = (
  state: RemoteVideoProducersCollection,
  videoProducer: RemoteVideoProducer
): RemoteVideoProducersCollection => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [videoProducer._id]: videoProducer,
    },
    byStageMember: {
      ...state.byStageMember,
      [videoProducer.stageMemberId]: state.byStageMember[videoProducer.stageMemberId]
        ? [...state.byStageMember[videoProducer.stageMemberId], videoProducer._id]
        : [videoProducer._id],
    },
    byStage: {
      ...state.byStage,
      [videoProducer.stageId]: state.byStage[videoProducer.stageId]
        ? [...state.byStage[videoProducer.stageId], videoProducer._id]
        : [videoProducer._id],
    },
    allIds: upsert<string>(state.allIds, videoProducer._id),
  };
};

function reduceVideoProducers(
  state: RemoteVideoProducersCollection = {
    byId: {},
    byStageMember: {},
    byStage: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): RemoteVideoProducersCollection {
  switch (action.type) {
    case ServerStageEvents.STAGE_LEFT:
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byStageMember: {},
        byStage: {},
        allIds: [],
      };
    }
    case ServerStageEvents.STAGE_JOINED: {
      const { remoteVideoProducers } = action.payload as InitialStagePackage;
      let updatedState = { ...state };
      if (remoteVideoProducers)
        remoteVideoProducers.forEach((videoProducer) => {
          updatedState = addVideoProducer(updatedState, videoProducer);
        });
      return updatedState;
    }
    case ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED: {
      const videoProducer = action.payload as RemoteVideoProducer;
      return addVideoProducer(state, videoProducer);
    }
    case ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED: {
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
    case ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED: {
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

export default reduceVideoProducers;
