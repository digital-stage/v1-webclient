import {
  ServerDeviceEvents,
  ServerGlobalEvents, ServerStageEvents,
  ServerUserEvents,
} from '../../global/SocketEvents';
import { GlobalStore } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../../types/InitialStagePackage';

function global(
  state: GlobalStore = {
    ready: false,
    stageId: undefined,
    localDeviceId: undefined,
    groupId: undefined,
  },
  action: {
    type: string;
    payload: any;
  }
): GlobalStore {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        ready: false,
        stageId: undefined,
        localDeviceId: undefined,
        groupId: undefined,
      };
    }
    case ServerGlobalEvents.READY:
      return {
        ...state,
        ready: true,
      };
    case ServerStageEvents.STAGE_JOINED: {
      const { stageId, groupId } = action.payload as InitialStagePackage;
      return {
        ...state,
        stageId,
        groupId,
      };
    }
    case ServerStageEvents.STAGE_LEFT:
      return {
        ...state,
        stageId: undefined,
        groupId: undefined,
      };
    case ServerUserEvents.USER_READY:
      return {
        ...state,
        userId: action.payload._id,
      };
    case ServerDeviceEvents.LOCAL_DEVICE_READY:
      return {
        ...state,
        localDeviceId: action.payload._id,
      };
    default:
      return state;
  }
}

export default global;
