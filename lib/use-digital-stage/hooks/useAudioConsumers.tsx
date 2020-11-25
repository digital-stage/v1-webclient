import { useSelector } from 'react-redux';
import { LocalConsumersCollection, RootReducer } from '../types';

const useAudioConsumers = (): LocalConsumersCollection =>
  useSelector<RootReducer, LocalConsumersCollection>((state) => state.audioConsumers);
export default useAudioConsumers;
