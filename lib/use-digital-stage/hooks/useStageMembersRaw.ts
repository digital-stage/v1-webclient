import { useSelector } from 'react-redux';
import { RootReducer, StageMembersCollection } from '../types';

const useStageMembers = (): StageMembersCollection =>
  useSelector<RootReducer, StageMembersCollection>((state) => state.stageMembers);
export default useStageMembers;
