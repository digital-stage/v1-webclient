import { useSelector } from 'react-redux';
import { Device, RootReducer } from '../types';

const useLocalDevice = (): Device[] =>
  useSelector<RootReducer, Device[]>((state) =>
    state.global.localDeviceId
      ? state.devices.allIds
          .filter((id) => id !== state.global.localDeviceId)
          .map((id) => state.devices.byId[id])
      : state.devices.allIds.map((id) => state.devices.byId[id])
  );
export default useLocalDevice;
