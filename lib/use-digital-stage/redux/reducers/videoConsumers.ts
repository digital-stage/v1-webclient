import omit from 'lodash/omit';
import without from 'lodash/without';
import { LocalConsumer, LocalConsumersCollection } from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';

function videoConsumers(
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
): LocalConsumersCollection {
  switch (action.type) {
    case AdditionalReducerTypes.ADD_VIDEO_CONSUMER: {
      const videoConsumer = action.payload as LocalConsumer;
      return {
        ...state,
        byId: {
          ...state.byId,
          [videoConsumer._id]: videoConsumer,
        },
        byStageMember: {
          ...state.byStageMember,
          [videoConsumer.stageMemberId]: state.byStageMember[videoConsumer.stageMemberId]
            ? [...state.byStageMember[videoConsumer.stageMemberId], videoConsumer._id]
            : [videoConsumer._id],
        },
        byProducer: {
          ...state.byProducer,
          [videoConsumer.producerId]: videoConsumer._id,
        },
        allIds: [...state.allIds, videoConsumer._id],
      };
    }
    case AdditionalReducerTypes.REMOVE_VIDEO_CONSUMER: {
      const id = action.payload as string;
      if (!state.byId[id]) {
        return state;
      }
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

export default videoConsumers;
