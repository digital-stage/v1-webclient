import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import { CustomRemoteAudioProducer, CustomRemoteAudioProducersCollection } from '../../types';
import { InitialStagePackage } from '../../types/InitialStagePackage';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import upsert from '../utils/upsert';

const addCustomAudioProducer = (
  state: CustomRemoteAudioProducersCollection,
  customAudioProducer: CustomRemoteAudioProducer
): CustomRemoteAudioProducersCollection => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [customAudioProducer._id]: customAudioProducer,
    },
    byAudioProducer: {
      ...state.byAudioProducer,
      [customAudioProducer.remoteAudioProducerId]: customAudioProducer._id,
    },
    allIds: upsert<string>(state.allIds, customAudioProducer._id),
  };
};

function reduceCustomAudioProducers(
  state: CustomRemoteAudioProducersCollection = {
    byId: {},
    byAudioProducer: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): CustomRemoteAudioProducersCollection {
  switch (action.type) {
    case ServerGlobalEvents.STAGE_LEFT:
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byAudioProducer: {},
        allIds: [],
      };
    }
    case ServerGlobalEvents.STAGE_JOINED: {
      const { customRemoteAudioProducers } = action.payload as InitialStagePackage;
      let updatedState = { ...state };
      if (customRemoteAudioProducers)
        customRemoteAudioProducers.forEach((customAudioProducer) => {
          updatedState = addCustomAudioProducer(updatedState, customAudioProducer);
        });
      return updatedState;
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED: {
      const customAudioProducer = action.payload as CustomRemoteAudioProducer;
      return addCustomAudioProducer(state, customAudioProducer);
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED: {
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
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED: {
      const id = action.payload as string;
      const { remoteAudioProducerId } = state.byId[id];
      return {
        ...state,
        byId: omit(state.byId, id),
        byAudioProducer: omit(state.byAudioProducer, remoteAudioProducerId),
        allIds: without<string>(state.allIds, id),
      };
    }
    default:
      return state;
  }
}

export default reduceCustomAudioProducers;
