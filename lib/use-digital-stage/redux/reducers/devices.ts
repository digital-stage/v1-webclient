import omit from 'lodash/omit';
import without from 'lodash/without';
import { DevicesCollection } from '../../types';
import { ServerDeviceEvents } from '../../global/SocketEvents';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';

function devices(
  state: DevicesCollection = {
    byId: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): DevicesCollection {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        allIds: [],
      };
    }
    case ServerDeviceEvents.LOCAL_DEVICE_READY:
    case ServerDeviceEvents.DEVICE_ADDED:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: action.payload,
        },
        allIds: [...state.allIds, action.payload._id],
      };
    case ServerDeviceEvents.DEVICE_CHANGED:
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
    case ServerDeviceEvents.DEVICE_REMOVED:
      return {
        ...state,
        byId: omit(state.byId, action.payload),
        allIds: without<string>(state.allIds, action.payload),
      };
    default:
      return state;
  }
}

export default devices;
