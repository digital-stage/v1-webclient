import { shallowEqual, useSelector } from 'react-redux';
import { GroupsCollection, RootReducer } from '../types';

const useGroups = (): GroupsCollection =>
  useSelector<RootReducer, GroupsCollection>((state) => state.groups, shallowEqual);
export default useGroups;
