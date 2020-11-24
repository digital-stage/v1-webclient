import { useSelector } from 'react-redux';
import { RootReducer } from '../types';

const useCurrentStageId = (): string | undefined =>
  useSelector<RootReducer, string | undefined>((state) => state.global.stageId);
export default useCurrentStageId;
