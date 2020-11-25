import { useSelector } from 'react-redux';
import { RootReducer } from '../types';

const useIsStageAdmin = () =>
  useSelector<RootReducer, boolean>((state) =>
    state.global.stageId && state.global.userId
      ? state.stages.byId[state.global.stageId].admins.indexOf(state.global.userId) !== -1
      : false
  );
/** Worst name of the year... ideas? * */
export default useIsStageAdmin;
