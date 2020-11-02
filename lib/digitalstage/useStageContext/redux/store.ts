import { useMemo } from 'react';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { InitialNormalizedState, NormalizedState } from '../schema';
import stageReducer, { ReducerAction } from './reducers';

let store: Store<NormalizedState, ReducerAction>;

function initStore(
  preloadedState: NormalizedState = InitialNormalizedState,
): Store<NormalizedState, ReducerAction> {
  return createStore<NormalizedState, ReducerAction, any, any>(
    stageReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware()),
  );
}

export const initializeStore = (
  preloadedState: NormalizedState,
): Store<NormalizedState, ReducerAction> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let _store: Store<NormalizedState> = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState: NormalizedState) {
  return useMemo(() => initializeStore(initialState), [initialState]);
}
