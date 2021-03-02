import omit from 'lodash/omit';
import without from 'lodash/without';
import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import {RemoteOvTrack, RemoteOvTrackCollection} from '../../types';
import { InitialStagePackage } from '../../types/InitialStagePackage';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import upsert from '../utils/upsert';

const addRemoteOvTrack = (
    state: RemoteOvTrackCollection,
    remoteOvTrack: RemoteOvTrack
): RemoteOvTrackCollection => {
    return {
        ...state,
        byId: {
            ...state.byId,
            [remoteOvTrack._id]: remoteOvTrack,
        },
        byStageMember: {
            ...state.byStageMember,
            [remoteOvTrack.stageMemberId]: state.byStageMember[remoteOvTrack.stageMemberId]
                ? [...state.byStageMember[remoteOvTrack.stageMemberId], remoteOvTrack._id]
                : [remoteOvTrack._id],
        },
        byStage: {
            ...state.byStage,
            [remoteOvTrack.stageId]: state.byStage[remoteOvTrack.stageId]
                ? [...state.byStage[remoteOvTrack.stageId], remoteOvTrack._id]
                : [remoteOvTrack._id],
        },
        allIds: upsert<string>(state.allIds, remoteOvTrack._id),
    };
};

function remoteOvTracks(
    state: RemoteOvTrackCollection = {
        byId: {},
        byStageMember: {},
        byStage: {},
        allIds: [],
    },
    action: {
        type: string;
        payload: any;
    }
): RemoteOvTrackCollection {
    switch (action.type) {
        case ServerGlobalEvents.STAGE_LEFT:
        case AdditionalReducerTypes.RESET: {
            return {
                byId: {},
                byStageMember: {},
                byStage: {},
                allIds: [],
            };
        }
        case ServerGlobalEvents.STAGE_JOINED: {
            const { remoteOvTracks } = action.payload as InitialStagePackage;
            let updatedState = { ...state };
            if (remoteOvTracks)
                remoteOvTracks.forEach((remoteOvTrack) => {
                    updatedState = addRemoteOvTrack(updatedState, remoteOvTrack);
                });
            return updatedState;
        }
        case ServerStageEvents.STAGE_MEMBER_OV_ADDED: {
            const remoteOvTrack = action.payload as RemoteOvTrack;
            return addRemoteOvTrack(state, remoteOvTrack);
        }
        case ServerStageEvents.STAGE_MEMBER_OV_CHANGED: {
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
        case ServerStageEvents.STAGE_MEMBER_OV_REMOVED: {
            const id = action.payload as string;
            if (!state.byId[id]) {
                return state;
            }
            const { stageId, stageMemberId } = state.byId[id];
            return {
                ...state,
                byId: omit(state.byId, id),
                byStageMember: {
                    ...state.byStageMember,
                    [stageMemberId]: without(state.byStageMember[stageMemberId], id),
                },
                byStage: {
                    ...state.byStage,
                    [stageId]: without(state.byStage[stageId], id),
                },
                allIds: without<string>(state.allIds, id),
            };
        }
        default:
            return state;
    }
}

export default remoteOvTracks;
