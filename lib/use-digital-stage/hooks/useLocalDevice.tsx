import { useSelector } from 'react-redux';
import { Device, RootReducer } from '../types';

const useLocalDevice = (): Device | undefined =>
  useSelector<RootReducer, Device | undefined>((state) =>
    state.global.localDeviceId ? state.devices.byId[state.global.localDeviceId] : undefined
  );
export default useLocalDevice;
