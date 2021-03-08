import omit from 'lodash/omit';
import without from 'lodash/without';
import {  ServerStageEvents } from '../../global/SocketEvents';
import {
  CustomRemoteAudioProducerVolume,
  CustomRemoteAudioProducerVolumeCollection
} from '../../types';
import { InitialStagePackage } from '../../types/InitialStagePackage';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import upsert from '../utils/upsert';

const addCustomAudioProducerVolume = (
  state: CustomRemoteAudioProducerVolumeCollection,
  customAudioProducerVolume: CustomRemoteAudioProducerVolume
): CustomRemoteAudioProducerVolumeCollection => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [customAudioProducerVolume._id]: customAudioProducerVolume,
    },
    byAudioProducer: {
      ...state.byAudioProducer,
      [customAudioProducerVolume.remoteAudioProducerId]: customAudioProducerVolume._id,
    },
    allIds: upsert<string>(state.allIds, customAudioProducerVolume._id),
  };
};

function reduceCustomAudioProducerVolumes(
  state: CustomRemoteAudioProducerVolumeCollection = {
    byId: {},
    byAudioProducer: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): CustomRemoteAudioProducerVolumeCollection {
  switch (action.type) {
    case ServerStageEvents.STAGE_LEFT:
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byAudioProducer: {},
        allIds: [],
      };
    }
    case ServerStageEvents.STAGE_JOINED: {
      const { customRemoteAudioProducerVolumes } = action.payload as InitialStagePackage;
      let updatedState = { ...state };
      if (customRemoteAudioProducerVolumes)
        customRemoteAudioProducerVolumes.forEach((customAudioProducer) => {
          updatedState = addCustomAudioProducerVolume(updatedState, customAudioProducer);
        });
      return updatedState;
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_VOLUME_ADDED: {
      const customAudioProducer = action.payload as CustomRemoteAudioProducerVolume;
      return addCustomAudioProducerVolume(state, customAudioProducer);
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_VOLUME_CHANGED: {
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
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_VOLUME_REMOVED: {
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

export default reduceCustomAudioProducerVolumes;
