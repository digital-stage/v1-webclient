import { useSelector } from 'react-redux';
import { CustomGroupsCollection, RootReducer } from '../types';

const useCustomGroups = (): CustomGroupsCollection =>
  useSelector<RootReducer, CustomGroupsCollection>((state) => state.customGroups);
export default useCustomGroups;
