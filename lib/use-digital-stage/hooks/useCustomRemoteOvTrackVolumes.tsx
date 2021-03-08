import { useSelector } from 'react-redux';
import {
  CustomRemoteAudioProducerPositionCollection,
  CustomRemoteOvTrackVolume,
  CustomRemoteOvTrackVolumeCollection,
  RootReducer
} from '../types';
import useCustomRemoteOvTrackPositions from "./useCustomRemoteOvTrackPositions";

const useCustomRemoteOvTrackVolumes = (): CustomRemoteOvTrackVolumeCollection =>
  useSelector<RootReducer, CustomRemoteOvTrackVolumeCollection>(
    (state) => state.customRemoteOvTrackVolumes
  );
export default useCustomRemoteOvTrackVolumes;
