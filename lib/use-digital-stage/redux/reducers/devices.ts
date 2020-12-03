import omit from 'lodash/omit';
import without from 'lodash/without';
import { Device, DevicesCollection } from '../../types';
import { ServerDeviceEvents } from '../../global/SocketEvents';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import upsert from '../utils/upsert';

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
    case ServerDeviceEvents.DEVICE_ADDED: {
      const device = action.payload as Device;
      return {
        ...state,
        byId: {
          ...state.byId,
          [device._id]: device,
        },
        allIds: upsert<string>(state.allIds, device._id),
      };
    }
    case ServerDeviceEvents.DEVICE_CHANGED: {
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
    case ServerDeviceEvents.DEVICE_REMOVED: {
      return {
        ...state,
        byId: omit(state.byId, action.payload),
        allIds: without<string>(state.allIds, action.payload),
      };
    }
    default:
      return state;
  }
}

export default devices;
