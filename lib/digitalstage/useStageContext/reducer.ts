import {Reducer} from "react";
import {InitialNormalizedState, NormalizedState, OutsideStageNormalizedState} from "./schema";
import {ServerDeviceEvents, ServerGlobalEvents, ServerStageEvents, ServerUserEvents} from "../common/events";
import {normalize} from "./normalizer";
import {removeItem, removeItemWithArrayReference, removeItemWithReference, updateItem, upsert} from "./utils";

export enum AdditionalReducerTypes {
    RESET = "reset",

    ADD_AUDIO_CONSUMER = 'add-audio-consumer',
    REMOVE_AUDIO_CONSUMER = 'remove-audio-consumer',

    ADD_VIDEO_CONSUMER = 'add-video-consumer',
    REMOVE_VIDEO_CONSUMER = 'remove-video-consumer',
}

export interface ReducerAction {
    type: ServerGlobalEvents | ServerUserEvents | ServerDeviceEvents | ServerStageEvents | AdditionalReducerTypes,
    payload?: any;
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
            console.log(action.payload);
            // Refresh also references
            if (state.stageMembers.byId[action.payload._id]) {
                if (action.payload.groupId && state.stageMembers.byId[action.payload._id].groupId !== action.payload.groupId) {
                    // Remove old group assignment
                    state.groups.byId[state.stageMembers.byId[action.payload._id].groupId].stageMembers = state.groups.byId[state.stageMembers.byId[action.payload._id].groupId].stageMembers.filter(id => id === action.payload._id);
                    upsert(state.groups.byId[action.payload.groupId].stageMembers, action.payload._id);
                }
            }
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
                videoProducers: [action.payload]
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


        case AdditionalReducerTypes.ADD_VIDEO_CONSUMER:
            return {
                ...state,
                videoConsumers: {
                    ...state.videoConsumers,
                    byId: {
                        ...state.videoConsumers.byId,
                        [action.payload.msConsumer.id]: {
                            videoProducer: action.payload.producerId,
                            msConsumer: action.payload.msConsumer
                        }
                    },
                    allIds: upsert(state.videoConsumers.allIds, action.payload.msConsumer.id)
                },
                videoProducers: {
                    ...state.videoProducers,
                    byId: {
                        ...state.videoProducers.byId,
                        [action.payload.producerId]: {
                            ...state.videoProducers.byId[action.payload.producerId],
                            consumer: action.payload.msConsumer.id
                        }
                    }
                }
            };

        case AdditionalReducerTypes.REMOVE_VIDEO_CONSUMER:
            return removeItemWithReference(state, "videoConsumers", action.payload, {
                group: "videoProducers",
                id: state.videoConsumers.byId[action.payload].videoProducer,
                key: "consumer"
            })
    }
    return state;
}