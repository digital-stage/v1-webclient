import { useSelector } from 'react-redux';
import { CustomGroupPositionCollection, RootReducer } from '../types';

const useCustomGroupPositions = (): CustomGroupPositionCollection =>
  useSelector<RootReducer, CustomGroupPositionCollection>((state) => state.customGroupPositions);
export default useCustomGroupPositions;
