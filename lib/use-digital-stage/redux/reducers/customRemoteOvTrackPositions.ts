import omit from 'lodash/omit';
import without from 'lodash/without';
import {ServerStageEvents} from '../../global/SocketEvents';
import {
    CustomRemoteOvTrackPosition,
    CustomRemoteOvTrackPositionCollection
} from '../../types';
import { InitialStagePackage } from '../../types/InitialStagePackage';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import upsert from '../utils/upsert';

const addCustomRemoteOvTrackPosition = (
    state: CustomRemoteOvTrackPositionCollection,
    remoteCustomOvTrack: CustomRemoteOvTrackPosition
): CustomRemoteOvTrackPositionCollection => {
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

function customRemoteOvTrackPositions(
    state: CustomRemoteOvTrackPositionCollection = {
        byId: {},
        byRemoteOvTrack: {},
        allIds: [],
    },
    action: {
        type: string;
        payload: any;
    }
): CustomRemoteOvTrackPositionCollection {
    switch (action.type) {
        case ServerStageEvents.STAGE_LEFT:
        case AdditionalReducerTypes.RESET: {
            return {
                byId: {},
                byRemoteOvTrack: {},
                allIds: [],
            };
        }
        case ServerStageEvents.STAGE_JOINED: {
            const {customRemoteOvTrackPositions} = action.payload as InitialStagePackage;
            let updatedState = {...state};
            if (customRemoteOvTrackPositions)
                customRemoteOvTrackPositions.forEach((customOvTrack) => {
                    updatedState = addCustomRemoteOvTrackPosition(updatedState, customOvTrack);
                });
            return updatedState;
        }
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_ADDED: {
            const customRemoteOvTrack = action.payload as CustomRemoteOvTrackPosition;
            return addCustomRemoteOvTrackPosition(state, customRemoteOvTrack);
        }
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_CHANGED: {
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
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_REMOVED: {
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

export default customRemoteOvTrackPositions;
