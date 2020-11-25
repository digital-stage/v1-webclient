import { useSelector } from 'react-redux';
import { DevicesCollection, RootReducer } from '../types';

const useDevices = (): DevicesCollection =>
  useSelector<RootReducer, DevicesCollection>((state) => state.devices);
export default useDevices;
