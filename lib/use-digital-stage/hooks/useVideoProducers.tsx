import { useSelector } from 'react-redux';
import { RemoteVideoProducersCollection, RootReducer } from '../types';

const useVideoProducers = (): RemoteVideoProducersCollection =>
  useSelector<RootReducer, RemoteVideoProducersCollection>((state) => state.videoProducers);
export default useVideoProducers;
