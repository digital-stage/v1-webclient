import { RootReducer } from '../types';
import { useSelector } from 'react-redux';

const useIsStageAdmin = () =>
  useSelector<RootReducer, boolean>(
    (state) =>
      state.global.stageId &&
      state.global.userId &&
      state.stages.byId[state.global.stageId].admins.indexOf(state.global.userId) !== -1
  );
/** Worst name of the year... ideas? **/
export default useIsStageAdmin;
