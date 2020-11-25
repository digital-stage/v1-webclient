import { useSelector } from 'react-redux';
import { CustomStageMembersCollection, RootReducer } from '../types';

const useCustomStageMembers = (): CustomStageMembersCollection =>
  useSelector<RootReducer, CustomStageMembersCollection>((state) => state.customStageMembers);
export default useCustomStageMembers;
