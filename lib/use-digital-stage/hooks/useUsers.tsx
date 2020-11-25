import { useSelector } from 'react-redux';
import { RootReducer, UsersCollection } from '../types';

const useUsers = (): UsersCollection =>
  useSelector<RootReducer, UsersCollection>((state) => state.users);
export default useUsers;
