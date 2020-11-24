import omit from 'lodash/omit';
import without from 'lodash/without';
import { LocalConsumer, LocalConsumersCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';

function audioConsumers(
  state: LocalConsumersCollection = {
    byId: {},
    byStageMember: {},
    byProducer: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case AdditionalReducerTypes.ADD_AUDIO_CONSUMER: {
      const audioConsumer = action.payload as LocalConsumer;
      return {
        ...state,
        byId: {
          ...state.byId,
          [audioConsumer._id]: audioConsumer,
        },
        byStageMember: {
          ...state.byStageMember,
          [audioConsumer.stageMemberId]: [
            ...state.byStageMember[audioConsumer.stageMemberId],
            audioConsumer._id,
          ],
        },
        byProducer: {
          ...state.byProducer,
          [audioConsumer.producerId]: audioConsumer._id,
        },
        allIds: [...state.allIds, audioConsumer._id],
      };
    }
    case AdditionalReducerTypes.REMOVE_AUDIO_CONSUMER: {
      const id = action.payload as string;
      const { stageMemberId } = state.byId[id];
      const { producerId } = state.byId[id];
      return {
        ...state,
        byId: omit(state.byId, id),
        byStageMember: {
          ...state.byStageMember,
          [stageMemberId]: without<string>(state.byStageMember[stageMemberId], id),
        },
        byProducer: omit(state.byProducer, producerId),
        allIds: without<string>(state.allIds, id),
      };
    }
    default:
      return state;
  }
}

export default audioConsumers;
