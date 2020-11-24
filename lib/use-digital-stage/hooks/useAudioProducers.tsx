import { useSelector } from 'react-redux';
import { RemoteAudioProducersCollection, RootReducer } from '../types';

const useAudioProducers = (): RemoteAudioProducersCollection =>
  useSelector<RootReducer, RemoteAudioProducersCollection>((state) => state.audioProducers);
export default useAudioProducers;
