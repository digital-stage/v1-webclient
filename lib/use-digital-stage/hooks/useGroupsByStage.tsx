import { useSelector } from 'react-redux';
import { Group, RootReducer } from '../types';

const useGroupsByStage = (stageId: string): Group[] =>
  useSelector<RootReducer, Group[]>((state) =>
    state.groups.byStage[stageId]
      ? state.groups.byStage[stageId].map((id) => state.groups.byId[id])
      : []
  );
export default useGroupsByStage;
