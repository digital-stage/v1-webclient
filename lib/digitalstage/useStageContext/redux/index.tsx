import { compose, createStore, Dispatch } from 'redux';
import { MakeStore, createWrapper } from 'next-redux-wrapper';
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import { NormalizedState } from '../schema';
import rootReducer, { ReducerAction } from './reducers';

const composeEnhancers =
  (typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const useDispatch: () => Dispatch<ReducerAction> = useReduxDispatch;

export const useSelector = useReduxSelector;

const makeStore: MakeStore<NormalizedState> = () =>
  createStore(rootReducer, composeEnhancers());

export const wrapper = createWrapper<NormalizedState>(makeStore, {
  debug: true
});
