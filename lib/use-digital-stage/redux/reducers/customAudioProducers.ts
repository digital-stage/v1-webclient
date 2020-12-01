import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import { CustomRemoteAudioProducer, CustomRemoteAudioProducersCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../actions/stageActions';
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
      [customAudioProducer.stageMemberAudioProducerId]: customAudioProducer._id,
    },
    allIds: upsert<string>(state.allIds, customAudioProducer._id),
  };
};

function customAudioProducers(
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
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byAudioProducer: {},
        allIds: [],
      };
    }
    case ServerGlobalEvents.STAGE_JOINED: {
      const { customAudioProducers } = action.payload as InitialStagePackage;
      let updatedState = { ...state };
      if (customAudioProducers)
        customAudioProducers.forEach((customAudioProducer) => {
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
      const { stageMemberAudioProducerId } = state.byId[id];
      return {
        ...state,
        byId: omit(state.byId, id),
        byAudioProducer: omit(state.byAudioProducer, stageMemberAudioProducerId),
        allIds: without<string>(state.allIds, id),
      };
    }
    default:
      return state;
  }
}

export default customAudioProducers;
