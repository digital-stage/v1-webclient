import omit from 'lodash/omit';
import without from 'lodash/without';
import {ServerGlobalEvents, ServerStageEvents} from '../../global/SocketEvents';
import {
    CustomRemoteOvTrack,
    CustomRemoteOvTrackCollection
} from '../../types';
import { InitialStagePackage } from '../../types/InitialStagePackage';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import upsert from '../utils/upsert';

const addCustomRemoteOvTrack = (
    state: CustomRemoteOvTrackCollection,
    remoteCustomOvTrack: CustomRemoteOvTrack
): CustomRemoteOvTrackCollection => {
    return {
        ...state,
        byId: {
            ...state.byId,
            [remoteCustomOvTrack._id]: remoteCustomOvTrack,
        },
        byRemoteOvTrack: {
            ...state.byRemoteOvTrack,
            [remoteCustomOvTrack.remoteOvTrackId]: remoteCustomOvTrack._id,
        },
        allIds: upsert<string>(state.allIds, remoteCustomOvTrack._id),
    };
};

function customRemoteOvTracks(
    state: CustomRemoteOvTrackCollection = {
        byId: {},
        byRemoteOvTrack: {},
        allIds: [],
    },
    action: {
        type: string;
        payload: any;
    }
): CustomRemoteOvTrackCollection {
    switch (action.type) {
        case ServerGlobalEvents.STAGE_LEFT:
        case AdditionalReducerTypes.RESET: {
            return {
                byId: {},
                byRemoteOvTrack: {},
                allIds: [],
            };
        }
        case ServerGlobalEvents.STAGE_JOINED: {
            const {customRemoteOvTracks} = action.payload as InitialStagePackage;
            let updatedState = {...state};
            if (customRemoteOvTracks)
                customRemoteOvTracks.forEach((customOvTrack) => {
                    updatedState = addCustomRemoteOvTrack(updatedState, customOvTrack);
                });
            return updatedState;
        }
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED: {
            const customRemoteOvTrack = action.payload as CustomRemoteOvTrack;
            return addCustomRemoteOvTrack(state, customRemoteOvTrack);
        }
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED: {
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
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED: {
            const id = action.payload as string;
            const {remoteOvTrackId} = state.byId[id];
            return {
                ...state,
                byId: omit(state.byId, id),
                byRemoteOvTrack: omit(state.byRemoteOvTrack, remoteOvTrackId),
                allIds: without<string>(state.allIds, id),
            };
        }
        default:
            return state;
    }
}

export default customRemoteOvTracks;
