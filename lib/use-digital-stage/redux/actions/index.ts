import { AnyAction } from 'redux';
import stageActions from './stageActions';
import deviceActions from './deviceActions';
import {
  ServerDeviceEvents,
  ServerGlobalEvents,
  ServerStageEvents,
  ServerUserEvents,
} from '../../global/SocketEvents';
import { User } from '../../types';
import AdditionalReducerTypes from './AdditionalReducerTypes';

export interface ReducerAction extends AnyAction {
  type:
    | ServerGlobalEvents
    | ServerUserEvents
    | ServerDeviceEvents
    | ServerStageEvents
    | AdditionalReducerTypes;
  payload?: any;
}

const changeUser = (user: Partial<User>) => {
  return {
    type: ServerUserEvents.USER_CHANGED,
    payload: user,
  };
};
const handleUserReady = (user: User) => {
  return {
    type: ServerUserEvents.USER_READY,
    payload: user,
  };
};
const setReady = () => {
  return {
    type: ServerGlobalEvents.READY,
  };
};

const handleStageJoined = (payload: { stageId: string; groupId: string }) => {
  return {
    type: ServerGlobalEvents.STAGE_JOINED,
    payload,
  };
};
const handleStageLeft = () => {
  return {
    type: ServerGlobalEvents.STAGE_LEFT,
  };
};

const reset = () => {
  return {
    type: AdditionalReducerTypes.RESET,
  };
};

const allActions = {
  server: {
    changeUser,
    handleUserReady,
    handleStageJoined,
    handleStageLeft,
    setReady,
  },
  client: {
    reset,
  },
  stageActions,
  deviceActions,
};
export default allActions;
