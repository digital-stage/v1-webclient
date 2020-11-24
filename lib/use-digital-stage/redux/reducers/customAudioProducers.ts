import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerStageEvents } from '../../global/SocketEvents';
import { CustomRemoteAudioProducer, CustomRemoteAudioProducersCollection } from '../../types';

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
) {
  switch (action.type) {
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED: {
      const customAudioProducer = action.payload as CustomRemoteAudioProducer;
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
        allIds: [...state.allIds, customAudioProducer._id],
      };
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
