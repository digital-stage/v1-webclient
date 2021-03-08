import { useSelector } from 'react-redux';
import { CustomRemoteAudioProducerPositionCollection, RootReducer } from '../types';

const useCustomAudioProducerPositions = (): CustomRemoteAudioProducerPositionCollection =>
  useSelector<RootReducer, CustomRemoteAudioProducerPositionCollection>(
    (state) => state.customRemoteAudioProducerPositions
  );
export default useCustomAudioProducerPositions;
