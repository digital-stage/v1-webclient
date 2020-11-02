import stageActions from "./stageActions";
import deviceActions from "./deviceActions";
import { ServerGlobalEvents, ServerUserEvents } from "../../../common/events";
import * as Server from "../../../common/model.server";
import { AdditionalReducerTypes } from "../reducers";

const handleUserReady = (user: Server.User) => {
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

const reset = () => {
  return {
    type: AdditionalReducerTypes.RESET,
  };
};

const allActions = {
  server: {
    handleUserReady,
    setReady,
  },
  client: {
    reset,
  },
  stageActions,
  deviceActions,
};
export default allActions;
