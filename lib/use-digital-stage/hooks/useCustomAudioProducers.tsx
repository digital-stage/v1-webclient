import { useSelector } from 'react-redux';
import { CustomRemoteAudioProducersCollection, RootReducer } from '../types';

const useCustomAudioProducers = (): CustomRemoteAudioProducersCollection =>
  useSelector<RootReducer, CustomRemoteAudioProducersCollection>(
    (state) => state.customAudioProducers
  );
export default useCustomAudioProducers;
