import { Dispatch } from 'redux';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { ReducerAction } from './actions';

const useDispatch: () => Dispatch<ReducerAction> = useReduxDispatch;
export default useDispatch;
