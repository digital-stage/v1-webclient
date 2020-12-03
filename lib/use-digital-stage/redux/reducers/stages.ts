import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import { Stage, StagesCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { InitialStagePackage } from '../actions/stageActions';
import upsert from '../utils/upsert';

const addStage = (state: StagesCollection, stage: Stage): StagesCollection => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [stage._id]: stage,
    },
    allIds: upsert<string>(state.allIds, stage._id),
  };
};

function reduceStages(
  state: StagesCollection = {
    byId: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): StagesCollection {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        allIds: [],
      };
    }
    case ServerGlobalEvents.STAGE_JOINED: {
      const { stage } = action.payload as InitialStagePackage;
      if (stage) return addStage(state, stage);
      return state;
    }
    case ServerStageEvents.STAGE_ADDED: {
      const stage = action.payload as Stage;
      return addStage(state, stage);
    }
    case ServerStageEvents.STAGE_CHANGED:
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
    case ServerStageEvents.STAGE_REMOVED:
      return {
        ...state,
        byId: omit(state.byId, action.payload),
        allIds: without<string>(state.allIds, action.payload),
      };
    default:
      return state;
  }
}

export default reduceStages;
