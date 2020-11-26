import { useSelector } from 'react-redux';
import { RootReducer, StageMembersCollection } from '../types';

const useStageMembersRaw = (): StageMembersCollection =>
  useSelector<RootReducer, StageMembersCollection>((state) => state.stageMembers);
export default useStageMembersRaw;
