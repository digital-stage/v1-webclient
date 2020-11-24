import { useSelector } from 'react-redux';
import { Device, RootReducer } from '../types';

const useDevice = (id: string): Device | undefined =>
  useSelector<RootReducer, Device | undefined>((state) => state.devices.byId[id]);
export default useDevice;
