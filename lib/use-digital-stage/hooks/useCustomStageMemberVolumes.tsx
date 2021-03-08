import { useSelector } from 'react-redux';
import {CustomStageMemberVolumeCollection, RootReducer} from '../types';

const useCustomStageMemberVolumes = (): CustomStageMemberVolumeCollection =>
  useSelector<RootReducer, CustomStageMemberVolumeCollection>((state) => state.customStageMemberVolumes);
export default useCustomStageMemberVolumes;
