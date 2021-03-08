import omit from 'lodash/omit';
import without from 'lodash/without';
import {ServerStageEvents} from '../../global/SocketEvents';
import {CustomGroupVolume, CustomGroupVolumeCollection} from '../../types';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import {InitialStagePackage} from '../../types/InitialStagePackage';
import upsert from '../utils/upsert';

const addCustomGroupVolume = (
    state: CustomGroupVolumeCollection,
    customGroup: CustomGroupVolume
): CustomGroupVolumeCollection => {
    return {
        ...state,
        byId: {
            ...state.byId,
            [customGroup._id]: customGroup,
        },
        byGroup: {
            ...state.byGroup,
            [customGroup.groupId]: customGroup._id,
        },
        allIds: upsert<string>(state.allIds, customGroup._id),
    };
};

function reduceCustomGroupVolumes(
    state: CustomGroupVolumeCollection = {
        byId: {},
        byGroup: {},
        allIds: [],
    },
    action: {
        type: string;
        payload: any;
    }
): CustomGroupVolumeCollection {
    switch (action.type) {
        case ServerStageEvents.STAGE_LEFT:
        case AdditionalReducerTypes.RESET: {
            return {
                byId: {},
                byGroup: {},
                allIds: [],
            };
        }
        case ServerStageEvents.STAGE_JOINED: {
            const {customGroupVolumes} = action.payload as InitialStagePackage;
            let updatedState = {...state};
            if (customGroupVolumes)
                customGroupVolumes.forEach((customGroup) => {
                    updatedState = addCustomGroupVolume(updatedState, customGroup);
                });
            return updatedState;
        }
        case ServerStageEvents.CUSTOM_GROUP_VOLUME_ADDED: {
            const customGroup = action.payload as CustomGroupVolume;
            return addCustomGroupVolume(state, customGroup);
        }
        case ServerStageEvents.CUSTOM_GROUP_VOLUME_CHANGED: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload._id]: {
                        ...state.byId[action.payload._id],
                        ...action.payload,
                    },
                },
            };
        }
        case ServerStageEvents.CUSTOM_GROUP_VOLUME_REMOVED: {
            const id = action.payload as string;
            if (state.byId[id]) {
                // TODO: Why is the line above necessary?
                const {groupId} = state.byId[id];
                return {
                    ...state,
                    byId: omit(state.byId, id),
                    byGroup: omit(state.byGroup, groupId),
                    allIds: without<string>(state.allIds, id),
                };
            }
            return state;
        }
        default:
            return state;
    }
}

export default reduceCustomGroupVolumes;
