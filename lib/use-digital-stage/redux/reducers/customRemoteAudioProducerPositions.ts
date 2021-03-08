import omit from 'lodash/omit';
import without from 'lodash/without';
import {  ServerStageEvents } from '../../global/SocketEvents';
import {
  CustomRemoteAudioProducerPosition,
  CustomRemoteAudioProducerVolume,
  CustomRemoteAudioProducerVolumeCollection
} from '../../types';
import { InitialStagePackage } from '../../types/InitialStagePackage';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import upsert from '../utils/upsert';
import {CustomRemoteAudioProducerPositionCollection} from "../../types/CustomRemoteAudioProducerPositionCollection";

const addCustomAudioProducerPosition = (
  state: CustomRemoteAudioProducerPositionCollection,
  customAudioProducerPosition: CustomRemoteAudioProducerPosition
): CustomRemoteAudioProducerPositionCollection => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [customAudioProducerPosition._id]: customAudioProducerPosition,
    },
    byAudioProducer: {
      ...state.byAudioProducer,
      [customAudioProducerPosition.remoteAudioProducerId]: customAudioProducerPosition._id,
    },
    allIds: upsert<string>(state.allIds, customAudioProducerPosition._id),
  };
};

function reduceCustomAudioProducerPositions(
  state: CustomRemoteAudioProducerPositionCollection = {
    byId: {},
    byAudioProducer: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): CustomRemoteAudioProducerPositionCollection {
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
      const { customRemoteAudioProducerPositions } = action.payload as InitialStagePackage;
      let updatedState = { ...state };
      if (customRemoteAudioProducerPositions)
        customRemoteAudioProducerPositions.forEach((customAudioProducer) => {
          updatedState = addCustomAudioProducerPosition(updatedState, customAudioProducer);
        });
      return updatedState;
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_ADDED: {
      const customAudioProducer = action.payload as CustomRemoteAudioProducerPosition;
      return addCustomAudioProducerPosition(state, customAudioProducer);
    }
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_CHANGED: {
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
    case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_REMOVED: {
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

export default reduceCustomAudioProducerPositions;
