import { useSelector } from 'react-redux';
import { CustomStageMemberPositionCollection, RootReducer } from '../types';

const useCustomStageMemberPositions = (): CustomStageMemberPositionCollection =>
  useSelector<RootReducer, CustomStageMemberPositionCollection>((state) => state.customStageMemberPositions);
export default useCustomStageMemberPositions;
