import { useSelector } from 'react-redux';
import {
  CustomRemoteAudioProducerPositionCollection,
  CustomRemoteOvTrackPositionCollection,
  RootReducer
} from '../types';

const useCustomRemoteOvTrackPositions = (): CustomRemoteOvTrackPositionCollection =>
  useSelector<RootReducer, CustomRemoteOvTrackPositionCollection>(
    (state) => state.customRemoteOvTrackPositions
  );
export default useCustomRemoteOvTrackPositions;
