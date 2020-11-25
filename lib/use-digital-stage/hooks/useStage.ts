import { useSelector } from 'react-redux';
import { RootReducer, Stage } from '../types';

const useStage = (id: string): Stage | undefined =>
  useSelector<RootReducer, Stage | undefined>((state) => state.stages.byId[id]);
export default useStage;
