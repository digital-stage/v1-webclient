import { useSelector } from 'react-redux';
import { LocalConsumersCollection, RootReducer } from '../types';

const useVideoConsumers = (): LocalConsumersCollection =>
  useSelector<RootReducer, LocalConsumersCollection>((state) => state.videoConsumers);
export default useVideoConsumers;
