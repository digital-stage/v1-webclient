import { useSelector } from 'react-redux';
import {CustomGroupPositionCollection, CustomGroupVolumeCollection, RootReducer} from '../types';

const useCustomGroupVolumes = (): CustomGroupVolumeCollection =>
  useSelector<RootReducer, CustomGroupVolumeCollection>((state) => state.customGroupVolumes);
export default useCustomGroupVolumes;
