import { useSelector } from 'react-redux';
import { Group, RootReducer } from '../types';

const useGroup = (id: string): Group =>
  useSelector<RootReducer, Group>((state) => state.groups.byId[id]);
export default useGroup;
