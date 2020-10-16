import {WebRTCDevice} from "../../common/model.server";
import {NormalizedState} from "../schema";
import _ from "lodash";
import {ExtendedCollection} from "../model";

export const upsert = function <T>(arr: T[], value: T): T[] {
    if (!arr) {
        arr = [value];
        return arr;
    }
    if (_.indexOf(arr, value) === -1) {
        arr.push(value);
    }
    return arr;
}

export const filter = function <T>(arr: T[], value: T): T[] {
    return _.without(arr, value);
}

export function addItemToCollection<T>(state: ExtendedCollection<T>, id: string, payload: T): ExtendedCollection<T> {
    return {
        ...state,
        byId: {
            ...state.byId,
            [id]: payload,
        },
        allIds: upsert(state.allIds, id)
    }
}


export const updateItem = (state: NormalizedState, group: string, id: string, payload: any): NormalizedState => {
    return {
        ...state,
        [group]: {
            ...state[group],
            byId: {
                ...state[group].byId,
                [id]: {
                    ...state[group].byId[id],
                    ...payload
                }
            }
        }
    };
}
export const removeItem = (state: NormalizedState, group: string, id: string): NormalizedState => {
    return {
        ...state,
        [group]: {
            ...state[group],
            byId: _.omit(state[group].byId, id),
            allIds: filter(state[group].allIds, id)
        }
    }
}

export const removeItemWithArrayReference = (state: NormalizedState, group: string, id: string, reference: {
    group: string;
    id: string;
    key: string;
}): NormalizedState => {
    return {
        ...state,
        [reference.group]: {
            ...state[reference.group],
            byId: {
                ...state[reference.group].byId,
                [reference.id]: {
                    ...state[reference.group].byId[reference.id],
                    [reference.key]: state[reference.group].byId[reference.id][reference.key].filter(refId => refId !== id)
                }
            }
        },
        [group]: {
            byId: _.omit(state[group].byId, id),
            allIds: filter(state[group].allIds, id)
        }
    };
}

export const removeItemWithReference = (state: NormalizedState, group: string, id: string, reference: {
    group: string;
    id: string;
    key: string;
}): NormalizedState => {
    return {
        ...state,
        [reference.group]: {
            ...state[reference.group],
            byId: {
                ...state[reference.group].byId,
                [reference.id]: {
                    ...state[reference.group].byId[reference.id],
                    [reference.key]: undefined
                }
            }
        },
        [group]: {
            byId: _.omit(state[group].byId, id),
            allIds: filter(state[group].allIds, id)
        }
    };
}
