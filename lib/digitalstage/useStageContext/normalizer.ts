import {
    CustomGroup,
    CustomStageMember,
    CustomStageMemberAudioProducer,
    CustomStageMemberOvTrack, GlobalAudioProducer,
    Group,
    Stage,
    StageMember,
    StageMemberAudioProducer,
    StageMemberOvTrack,
    StageMemberVideoProducer,
    User
} from "../common/model.server";
import {InitialNormalizedState, NormalizedState, OutsideStageNormalizedState} from "./schema";
import {ServerDeviceEvents, ServerGlobalEvents, ServerStageEvents, ServerUserEvents} from "../common/events";
import _ from "lodash";
import {Reducer} from "react";
import mediasoupClient from "mediasoup-client";

export const upsert = function <T>(arr: T[], value: T): T[] {
    if (_.indexOf(arr, value) === -1) {
        arr.push(value);
    }
    return arr;
}

// See: https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape
export function normalize(prevState: NormalizedState, data: Partial<{
    stageId?: string;
    groupId?: string;
    users: User[];
    stages: Stage[];
    groups: Group[];
    stageMembers: StageMember[];
    customGroups: CustomGroup[];
    customStageMembers: CustomStageMember[];
    videoProducers: StageMemberVideoProducer[];
    audioProducers: StageMemberAudioProducer[];
    customAudioProducers: CustomStageMemberAudioProducer[];
    ovTracks: StageMemberOvTrack[];
    customOvTracks: CustomStageMemberOvTrack[];
}>): NormalizedState {
    const state: NormalizedState = {...prevState};
    if (data.stageId && data.groupId) {
        state.current = {
            stageId: data.stageId,
            groupId: data.groupId
        };
    }
    if (data.users) {
        data.users.forEach(user => {
            state.users.byId[user._id] = {
                stageMembers: state.stageMembers.allIds.filter(id => state.stageMembers.byId[id].userId === user._id),
                ...state.users.byId[user._id],
                ...user
            };
            state.users.allIds.push(user._id);
        });
    }
    if (data.stages) {
        data.stages.forEach(stage => {
            state.stages.byId[stage._id] = {
                groups: state.groups.allIds.filter(id => state.groups.byId[id].stageId === stage._id),
                isAdmin: stage.admins.indexOf(state.user._id) !== -1,
                ...stage
            };
            upsert(state.stages.allIds, stage._id);
        });
    }
    if (data.groups) {
        data.groups.forEach(group => {
            state.groups.byId[group._id] = {
                stageMembers: state.stageMembers.allIds.filter(id => state.stageMembers.byId[id].groupId === group._id),
                ...state.groups.byId[group._id],
                ...group
            };
            if (state.stages.byId[group.stageId])
                upsert(state.stages.byId[group.stageId].groups, group._id);
            upsert(state.groups.allIds, group._id);
        });
    }
    if (data.customGroups) {
        data.customGroups.forEach(customGroup => {
            state.customGroups.byId[customGroup._id] = {
                ...state.customGroups.byId[customGroup._id],
                ...customGroup
            };
            state.groups.byId[customGroup.groupId].customGroup = customGroup._id;
            upsert(state.customGroups.allIds, customGroup._id);
        });
    }
    if (data.stageMembers) {
        data.stageMembers.forEach(stageMember => {
            state.stageMembers.byId[stageMember._id] = {
                audioProducers: state.audioProducers.allIds.filter(id => state.audioProducers.byId[id].stageMemberId === stageMember._id),
                videoProducers: state.videoProducers.allIds.filter(id => state.videoProducers.byId[id].stageMemberId === stageMember._id),
                ovTracks: state.ovTracks.allIds.filter(id => state.ovTracks.byId[id].stageMemberId === stageMember._id),
                ...state.stageMembers.byId[stageMember._id],
                ...stageMember
            };
            upsert(state.stageMembers.allIds, stageMember._id);
        });
    }
    if (data.customStageMembers) {
        data.customStageMembers.forEach(customStageMember => {
            state.customStageMembers.byId[customStageMember._id] = {
                ...state.customStageMembers.byId[customStageMember._id],
                ...customStageMember
            };
            state.stageMembers.byId[customStageMember.stageMemberId].customStageMember = customStageMember._id;
            upsert(state.customStageMembers.allIds, customStageMember._id);
        });
    }
    if (data.videoProducers) {
        data.videoProducers.forEach(videoProducer => {
            state.videoProducers.byId[videoProducer._id] = {
                ...state.videoProducers.byId[videoProducer._id],
                ...videoProducer
            };
            state.stageMembers.byId[videoProducer.stageMemberId].videoProducers.push(videoProducer._id);
            upsert(state.videoProducers.allIds, videoProducer._id);
        });
    }
    if (data.audioProducers) {
        data.audioProducers.forEach(audioProducer => {
            state.audioProducers.byId[audioProducer._id] = {
                ...state.audioProducers.byId[audioProducer._id],
                ...audioProducer
            };
            state.stageMembers.byId[audioProducer.stageMemberId].audioProducers.push(audioProducer._id);
            upsert(state.audioProducers.allIds, audioProducer._id);
        });
    }
    if (data.customAudioProducers) {
        data.customAudioProducers.forEach(customAudioProducer => {
            state.customAudioProducers.byId[customAudioProducer._id] = {
                ...state.customOvTracks.byId[customAudioProducer._id],
                ...customAudioProducer
            };
            state.audioProducers.byId[customAudioProducer.stageMemberAudioProducerId].customAudioProducer = customAudioProducer._id;
            upsert(state.customAudioProducers.allIds, customAudioProducer._id);
        });
    }
    if (data.ovTracks) {
        data.ovTracks.forEach(ovTrack => {
            state.ovTracks.byId[ovTrack._id] = {
                ...state.ovTracks.byId[ovTrack._id],
                ...ovTrack
            };
            state.stageMembers.byId[ovTrack.stageMemberId].ovTracks.push(ovTrack._id);
            upsert(state.ovTracks.allIds, ovTrack._id);
        });
    }
    if (data.customOvTracks) {
        data.customOvTracks.forEach(customOvTrack => {
            state.customOvTracks.byId[customOvTrack._id] = {
                ...state.customOvTracks.byId[customOvTrack._id],
                ...customOvTrack
            };
            state.ovTracks.byId[customOvTrack.stageMemberOvTrackId].customOvTrack = customOvTrack._id;
            upsert(state.customOvTracks.allIds, customOvTrack._id);
        });
    }
    return state;
}

export enum AdditionalReducerTypes {
    RESET = "reset",

    ADD_LOCAL_AUDIO_PRODUCER = 'add-local-audio-producer',
    REMOVE_LOCAL_AUDIO_PRODUCER = 'remove-local-audio-producer',

    ADD_LOCAL_VIDEO_PRODUCER = 'add-local-video-producer',
    REMOVE_LOCAL_VIDEO_PRODUCER = 'remove-local-video-producer',

    ADD_AUDIO_CONSUMER = 'add-audio-consumer',
    REMOVE_AUDIO_CONSUMER = 'remove-audio-consumer',

    ADD_VIDEO_CONSUMER = 'add-video-consumer',
    REMOVE_VIDEO_CONSUMER = 'remove-video-consumer',
}

export interface ReducerAction {
    type: ServerGlobalEvents | ServerUserEvents | ServerDeviceEvents | ServerStageEvents | AdditionalReducerTypes,
    payload?: any;
}

const updateItem = (state: NormalizedState, group: string, id: string, payload: any): NormalizedState => {
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
const removeItem = (state: NormalizedState, group: string, id: string): NormalizedState => {
    return {
        ...state,
        [group]: {
            ...state[group],
            byId: _.omit(state[group].byId, id),
            allIds: state[group].allIds.filter(el => el !== id)
        }
    }
}
const removeItemWithArrayReference = (state: NormalizedState, group: string, id: string, reference: {
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
            allIds: state[group].allIds.filter(el => el !== id)
        }
    };
}
const removeItemWithReference = (state: NormalizedState, group: string, id: string, reference: {
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
            allIds: state[group].allIds.filter(el => el !== id)
        }
    };
}

export const reducer: Reducer<NormalizedState, ReducerAction> = (state: NormalizedState, action: ReducerAction) => {
    console.log(action.type);
    switch (action.type) {
        case AdditionalReducerTypes.RESET:
            return InitialNormalizedState;

        case ServerGlobalEvents.READY:
            return {
                ...state,
                ready: true
            };

        case ServerUserEvents.USER_READY:
            return {
                ...state,
                user: action.payload
            };

        case ServerDeviceEvents.LOCAL_DEVICE_READY:
            return {
                ...state,
                devices: {
                    ...state.devices,
                    byId: {
                        ...state.devices.byId,
                        [action.payload._id]: action.payload
                    },
                    local: action.payload._id,
                    allIds: upsert(state.devices.allIds, action.payload._id)
                }
            }

        case ServerDeviceEvents.DEVICE_ADDED:
            return {
                ...state,

                devices: {
                    ...state.devices,
                    byId: {
                        ...state.devices.byId,
                        [action.payload._id]: action.payload
                    },
                    remote: upsert(state.devices.remote, action.payload._id),
                    allIds: upsert(state.devices.allIds, action.payload._id)
                }
            }
        case ServerDeviceEvents.DEVICE_CHANGED:
            return updateItem(state, "devices", action.payload._id, action.payload);
        case ServerDeviceEvents.DEVICE_REMOVED:
            return {
                ...removeItem(state, "devices", action.payload),
                devices: {
                    ...state.devices,
                    remote: state.devices.remote.filter(id => id !== action.payload)
                }
            }

        case ServerStageEvents.USER_ADDED:
            return normalize(state, {
                users: [action.payload]
            });
        case ServerStageEvents.USER_CHANGED:
            return updateItem(state, "users", action.payload._id, action.payload);
        case ServerStageEvents.USER_REMOVED:
            state.users.byId[action.payload].stageMembers.forEach(id => {
                //TODO: Remove references inside stageMembers, immutable?!?
                state.stageMembers.byId[id].userId = undefined;
            });
            return removeItem(state, "users", action.payload);


        case ServerStageEvents.STAGE_JOINED:
            return normalize(state, {
                ...action.payload,
                stages: action.payload.stage ? [action.payload.stage] : []
            })
        case ServerStageEvents.STAGE_LEFT:
            return {
                ...state,
                ...OutsideStageNormalizedState
            };
        case ServerStageEvents.STAGE_ADDED:
            return normalize(state, {
                stages: [action.payload]
            });
        case ServerStageEvents.STAGE_CHANGED:
            return updateItem(state, "stages", action.payload._id, action.payload);
        case ServerStageEvents.STAGE_REMOVED:
            return removeItem(state, "stages", action.payload);

        case ServerStageEvents.GROUP_ADDED:
            return normalize(state, {
                groups: [action.payload]
            });
        case ServerStageEvents.GROUP_CHANGED:
            return updateItem(state, "groups", action.payload._id, action.payload);
        case ServerStageEvents.GROUP_REMOVED:
            return removeItemWithArrayReference(state, "groups", action.payload, {
                group: "stages",
                id: state.groups.byId[action.payload].stageId,
                key: "groups"
            });

        case ServerStageEvents.STAGE_MEMBER_ADDED:
            return normalize(state, {
                stageMembers: [action.payload]
            });
        case ServerStageEvents.STAGE_MEMBER_CHANGED:
            return updateItem(state, "stageMembers", action.payload._id, action.payload);
        case ServerStageEvents.STAGE_MEMBER_REMOVED:
            return removeItemWithArrayReference(state, "stageMembers", action.payload, {
                group: "groups",
                id: state.stageMembers.byId[action.payload].groupId,
                key: "stageMembers"
            });

        case ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED:
            return normalize(state, {
                customStageMembers: [action.payload]
            });
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED:
            return updateItem(state, "customStageMembers", action.payload._id, action.payload);
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED:
            return removeItemWithReference(state, "customStageMembers", action.payload, {
                group: "audioProducers",
                id: state.customAudioProducers.byId[action.payload].stageMemberAudioProducerId,
                key: "customStageMember"
            });


        case ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED:
            return normalize(state, {
                audioProducers: [action.payload]
            });
        case ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED:
            return updateItem(state, "audioProducers", action.payload._id, action.payload);
        case ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED:
            return removeItemWithArrayReference(state, "audioProducers", action.payload, {
                group: "stageMembers",
                id: state.audioProducers.byId[action.payload].stageMemberId,
                key: "audioProducers"
            });

        case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED:
            return normalize(state, {
                customAudioProducers: [action.payload]
            });
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED:
            return updateItem(state, "customAudioProducers", action.payload._id, action.payload);
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED:
            return removeItemWithArrayReference(state, "customAudioProducers", action.payload, {
                group: "audioProducers",
                id: state.customAudioProducers.byId[action.payload].stageMemberAudioProducerId,
                key: "customAudioProducers"
            });

        case ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED:
            return normalize(state, {
                audioProducers: [action.payload]
            });
        case ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED:
            return updateItem(state, "videoProducers", action.payload._id, action.payload);
        case ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED:
            return removeItemWithArrayReference(state, "videoProducers", action.payload, {
                group: "stageMembers",
                id: state.videoProducers.byId[action.payload].stageMemberId,
                key: "videoProducers"
            });


        case AdditionalReducerTypes.ADD_AUDIO_CONSUMER:
            return {
                ...state,
                audioConsumers: {
                    ...state.audioConsumers,
                    byId: {
                        ...state.audioConsumers.byId,
                        [action.payload.msConsumer.id]: {
                            audioProducer: action.payload.producerId,
                            msConsumer: action.payload.msConsumer
                        }
                    },
                    allIds: upsert(state.audioConsumers.allIds, action.payload.msConsumer.id)
                },
                audioProducers: {
                    ...state.audioProducers,
                    byId: {
                        ...state.audioProducers.byId,
                        [action.payload.producerId]: {
                            ...state.audioProducers.byId[action.payload.producerId],
                            consumer: action.payload.msConsumer.id
                        }
                    }
                }
            };

        case AdditionalReducerTypes.REMOVE_AUDIO_CONSUMER:
            return removeItemWithReference(state, "audioConsumers", action.payload, {
                group: "audioProducers",
                id: state.audioConsumers.byId[action.payload].audioProducer,
                key: "consumer"
            })

        case AdditionalReducerTypes.ADD_LOCAL_AUDIO_PRODUCER:
            return {
                ...state,
                localAudioProducers: {
                    ...state.localAudioProducers,
                    byId: {
                        ...state.localAudioProducers.byId,
                        [action.payload._id]: action.payload
                    },
                    allIds: upsert(state.localAudioProducers.allIds, action.payload._id)
                }
            }
        case AdditionalReducerTypes.REMOVE_LOCAL_AUDIO_PRODUCER:
            return removeItem(state, "localAudioProducers", action.payload);


        case AdditionalReducerTypes.ADD_LOCAL_VIDEO_PRODUCER:
            return {
                ...state,
                localAudioProducers: {
                    ...state.localAudioProducers,
                    byId: {
                        ...state.localAudioProducers.byId,
                        [action.payload.id]: action.payload
                    },
                    allIds: upsert(state.localAudioProducers.allIds, action.payload.id)
                }
            }
        case AdditionalReducerTypes.REMOVE_LOCAL_VIDEO_PRODUCER:
            return removeItem(state, "localAudioProducers", action.payload);
    }
    return state;
}