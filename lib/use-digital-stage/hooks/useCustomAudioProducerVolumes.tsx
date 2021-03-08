import { useSelector } from 'react-redux';
import {
  CustomRemoteAudioProducerPositionCollection,
  CustomRemoteAudioProducerVolumeCollection,
  RootReducer
} from '../types';

const useCustomAudioProducerVolumes = (): CustomRemoteAudioProducerVolumeCollection =>
  useSelector<RootReducer, CustomRemoteAudioProducerVolumeCollection>(
    (state) => state.customRemoteAudioProducerVolumes
  );
export default useCustomAudioProducerVolumes;
