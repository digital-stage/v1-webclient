import _ from 'lodash';
import { NormalizedState } from '../schema';
import { ExtendedCollection } from '../model';

export const upsert = function <T>(arr: Readonly<T[]>, value: T): T[] {
  if (!arr) {
    return [value];
  }
  if (_.indexOf<T>(arr, value) === -1) {
    return [...arr, value];
  }
  return [...arr];
};

export const filter = function <T>(arr: Readonly<T[]>, value: T): T[] {
  return _.without<T>(arr, value);
};

export function addItemToCollection<T>(
  state: Readonly<ExtendedCollection<T>>,
  id: string,
  payload: T,
): ExtendedCollection<T> {
  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: payload,
    },
    allIds: upsert<string>(state.allIds, id),
  };
}

export const updateItem = (
  state: Readonly<NormalizedState>,
  group: string,
  id: string,
  payload: any,
): NormalizedState => ({
  ...state,
  [group]: {
    ...state[group],
    byId: {
      ...state[group].byId,
      [id]: {
        ...state[group].byId[id],
        ...payload,
      },
    },
  },
});
export const removeItem = (
  state: Readonly<NormalizedState>,
  group: string,
  id: string,
): NormalizedState => ({
  ...state,
  [group]: {
    ...state[group],
    byId: _.omit(state[group].byId, id),
    allIds: filter(state[group].allIds, id),
  },
});

export const removeItemWithArrayReference = (
  state: Readonly<NormalizedState>,
  group: string,
  id: string,
  reference: {
    group: string;
    id: string;
    key: string;
  },
): NormalizedState => ({
  ...state,
  [reference.group]: {
    ...state[reference.group],
    byId: {
      ...state[reference.group].byId,
      [reference.id]: {
        ...state[reference.group].byId[reference.id],
        [reference.key]: state[reference.group].byId[reference.id][
          reference.key
        ].filter((refId) => refId !== id),
      },
    },
  },
  [group]: {
    byId: _.omit(state[group].byId, id),
    allIds: filter(state[group].allIds, id),
  },
});

export const removeItemWithReference = (
  state: Readonly<NormalizedState>,
  group: string,
  id: string,
  reference: {
    group: string;
    id: string;
    key: string;
  },
): NormalizedState => ({
  ...state,
  [reference.group]: {
    ...state[reference.group],
    byId: {
      ...state[reference.group].byId,
      [reference.id]: {
        ...state[reference.group].byId[reference.id],
        [reference.key]: undefined,
      },
    },
  },
  [group]: {
    byId: _.omit(state[group].byId, id),
    allIds: filter(state[group].allIds, id),
  },
});
