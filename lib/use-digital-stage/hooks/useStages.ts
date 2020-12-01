import { shallowEqual, useSelector } from 'react-redux';
import { RootReducer, StagesCollection } from '../types';

const useStages = (): StagesCollection =>
  useSelector<RootReducer, StagesCollection>((state) => state.stages, shallowEqual);
export default useStages;
