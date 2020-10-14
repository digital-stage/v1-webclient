import {InitialNormalizedState, NormalizedState, OutsideStageNormalizedState} from "../../schema";
import {ServerDeviceEvents, ServerGlobalEvents, ServerStageEvents, ServerUserEvents} from "../../../common/events";
import {removeItem, updateItem, upsert} from "../../utils";
import {normalize} from "../../normalizer";
import {AnyAction, Reducer} from "redux";
import _ from "lodash";

export enum AdditionalReducerTypes {
    RESET = "reset",

    ADD_AUDIO_CONSUMER = 'add-audio-consumer',
    REMOVE_AUDIO_CONSUMER = 'remove-audio-consumer',

    ADD_VIDEO_CONSUMER = 'add-video-consumer',
    REMOVE_VIDEO_CONSUMER = 'remove-video-consumer',
}

export interface ReducerAction extends AnyAction {
    type: ServerGlobalEvents | ServerUserEvents | ServerDeviceEvents | ServerStageEvents | AdditionalReducerTypes,
    payload?: any;
}


export const stage: Reducer<NormalizedState, ReducerAction> = (state: NormalizedState = InitialNormalizedState, action: ReducerAction): NormalizedState => {
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
            return {
                ...state,
                users: {
                    ...state.users,
                    byId: _.omit(state.users.byId, action.payload),
                    allIds: _.filter(state.users.allIds, action.payload)
                }
            };

        case ServerStageEvents.STAGE_JOINED:
            console.log(action.payload);
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
            return {
                ...state,
                stages: {
                    ...state.stages,
                    byId: _.omit(state.stages.byId, action.payload),
                    allIds: _.filter(state.stages.allIds, action.payload)
                }
            };

        case ServerStageEvents.GROUP_ADDED:
            return normalize(state, {
                groups: [action.payload]
            });
        case ServerStageEvents.GROUP_CHANGED:
            return updateItem(state, "groups", action.payload._id, action.payload);
        case ServerStageEvents.GROUP_REMOVED:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    byId: _.omit(state.groups.byId, action.payload),
                    byStage: {
                        ...state.groups.byStage,
                        [state.groups.byId[action.payload].stageId]: _.filter(state.groups.byStage[state.groups.byId[action.payload].stageId], action.payload),
                    },
                    allIds: _.filter(state.groups.allIds, action.payload)
                }
            };

        case ServerStageEvents.STAGE_MEMBER_ADDED:
            return normalize(state, {
                stageMembers: [action.payload]
            });
        case ServerStageEvents.STAGE_MEMBER_CHANGED:
            if (state.stageMembers.byId[action.payload._id]) {
                const oldGroupId = state.stageMembers.byId[action.payload._id].groupId;
                if (action.payload.groupId && oldGroupId !== action.payload.groupId) {
                    // Remove old byGroup entry
                    state.stageMembers.byGroup[oldGroupId] = _.remove(state.stageMembers.byGroup[oldGroupId], action.payload._id);
                    // Add new byGroup
                    state.stageMembers.byGroup[action.payload.groupId] = upsert(state.stageMembers.byGroup[action.payload.groupId], action.payload._id);
                }
            }
            return updateItem(state, "stageMembers", action.payload._id, action.payload);
        case ServerStageEvents.STAGE_MEMBER_REMOVED:
            return {
                ...state,
                stageMembers: {
                    ...state.stageMembers,
                    byId: _.omit(state.stageMembers.byId, action.payload),
                    byStage: {
                        ...state.stageMembers.byStage,
                        [state.stageMembers.byId[action.payload].stageId]: _.filter(state.stageMembers.byStage[state.stageMembers.byId[action.payload].stageId], action.payload),
                    },
                    byGroup: {
                        ...state.stageMembers.byGroup,
                        [state.stageMembers.byId[action.payload].groupId]: _.filter(state.stageMembers.byGroup[state.stageMembers.byId[action.payload].groupId], action.payload),
                    },
                    allIds: _.filter(state.stageMembers.allIds, action.payload)
                }
            };

        case ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED:
            return normalize(state, {
                customStageMembers: [action.payload]
            });
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED:
            return updateItem(state, "customStageMembers", action.payload._id, action.payload);
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED:
            return {
                ...state,
                customStageMembers: {
                    ...state.customStageMembers,
                    byId: _.omit(state.customStageMembers.byId, action.payload),
                    byStageMember: {
                        ...state.customStageMembers.byStageMember,
                        [state.customStageMembers.byId[action.payload].stageMemberId]: _.filter(state.customStageMembers.byStageMember[state.customStageMembers.byId[action.payload].stageMemberId], action.payload),
                    },
                    allIds: _.filter(state.stageMembers.allIds, action.payload)
                }
            };


        case ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED:
            return normalize(state, {
                audioProducers: [action.payload]
            });
        case ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED:
            return updateItem(state, "audioProducers", action.payload._id, action.payload);
        case ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED:
            return {
                ...state,
                audioProducers: {
                    ...state.audioProducers,
                    byId: _.omit(state.audioProducers.byId, action.payload),
                    byStageMember: {
                        ...state.audioProducers.byStageMember,
                        [state.audioProducers.byId[action.payload].stageMemberId]: _.filter(state.audioProducers.byStageMember[state.audioProducers.byId[action.payload].stageMemberId], action.payload),
                    },
                    allIds: _.filter(state.stageMembers.allIds, action.payload)
                }
            };

        case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED:
            return normalize(state, {
                customAudioProducers: [action.payload]
            });
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED:
            return updateItem(state, "customAudioProducers", action.payload._id, action.payload);
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED:
            return {
                ...state,
                customAudioProducers: {
                    ...state.customAudioProducers,
                    byId: _.omit(state.customAudioProducers.byId, action.payload),
                    byAudioProducer: {
                        ...state.customAudioProducers.byAudioProducer,
                        [state.customAudioProducers.byId[action.payload].stageMemberAudioProducerId]: _.filter(state.customAudioProducers.byAudioProducer[state.customAudioProducers.byId[action.payload].stageMemberAudioProducerId], action.payload),
                    },
                    allIds: _.filter(state.stageMembers.allIds, action.payload)
                }
            };

        case ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED:
            return normalize(state, {
                videoProducers: [action.payload]
            });
        case ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED:
            return updateItem(state, "videoProducers", action.payload._id, action.payload);
        case ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED:
            return {
                ...state,
                videoProducers: {
                    ...state.videoProducers,
                    byId: _.omit(state.videoProducers.byId, action.payload),
                    byStageMember: {
                        ...state.videoProducers.byStageMember,
                        [state.videoProducers.byId[action.payload].stageMemberId]: _.filter(state.videoProducers.byStageMember[state.videoProducers.byId[action.payload].stageMemberId], action.payload),
                    },
                    allIds: _.filter(state.stageMembers.allIds, action.payload)
                }
            };


        case AdditionalReducerTypes.ADD_AUDIO_CONSUMER:
            return {
                ...state,
                audioConsumers: {
                    ...state.audioConsumers,
                    byId: {
                        ...state.audioConsumers.byId,
                        [action.payload._id]: action.payload
                    },
                    byProducer: {
                        ...state.audioConsumers.byProducer,
                        [action.payload.audioProducer]: action.payload._id
                    },
                    byStage: {
                        ...state.audioConsumers.byStage,
                        [action.payload.stage]: action.payload._id
                    },
                    byStageMember: {
                        ...state.audioConsumers.byStageMember,
                        [action.payload.stageMember]: upsert(state.audioConsumers.byStageMember[action.payload.stageMemberId], action.payload._id),
                    },
                    allIds: upsert(state.audioConsumers.allIds, action.payload._id)
                }
            };

        case AdditionalReducerTypes.REMOVE_AUDIO_CONSUMER:
            return {
                ...state,
                audioConsumers: {
                    ...state.audioConsumers,
                    byId: _.omit(state.audioConsumers.byId, action.payload),
                    byStageMember: {
                        ...state.audioConsumers.byStageMember,
                        [state.audioConsumers.byId[action.payload].stageMember]: _.filter(state.audioConsumers.byStageMember[state.audioConsumers.byId[action.payload].stageMember], action.payload),
                    },
                    byStage: {
                        ...state.audioConsumers.byStage,
                        [state.audioConsumers.byId[action.payload].stage]: _.filter(state.audioConsumers.byStage[state.audioConsumers.byId[action.payload].stage], action.payload),
                    },
                    byProducer: _.omit(state.audioConsumers.byProducer, state.audioConsumers.byId[action.payload].audioProducer),
                    allIds: _.filter(state.audioConsumers.allIds, action.payload)
                }
            };


        case AdditionalReducerTypes.ADD_VIDEO_CONSUMER:
            return {
                ...state,
                videoConsumers: {
                    ...state.videoConsumers,
                    byId: {
                        ...state.videoConsumers.byId,
                        [action.payload._id]: action.payload
                    },
                    byProducer: {
                        ...state.videoConsumers.byProducer,
                        [action.payload.videoProducer]: action.payload._id
                    },
                    byStage: {
                        ...state.videoConsumers.byStage,
                        [action.payload.stage]: action.payload._id
                    },
                    byStageMember: {
                        ...state.videoConsumers.byStageMember,
                        [action.payload.stageMember]: upsert(state.videoConsumers.byStageMember[action.payload.stageMemberId], action.payload._id),
                    },
                    allIds: upsert(state.videoConsumers.allIds, action.payload._id)
                }
            };

        case AdditionalReducerTypes.REMOVE_VIDEO_CONSUMER:
            return {
                ...state,
                videoConsumers: {
                    ...state.videoConsumers,
                    byId: _.omit(state.videoConsumers.byId, action.payload),
                    byStageMember: {
                        ...state.videoConsumers.byStageMember,
                        [state.videoConsumers.byId[action.payload].stageMember]: _.filter(state.videoConsumers.byStageMember[state.videoConsumers.byId[action.payload].stageMember], action.payload),
                    },
                    byStage: {
                        ...state.videoConsumers.byStage,
                        [state.videoConsumers.byId[action.payload].stage]: _.filter(state.videoConsumers.byStage[state.videoConsumers.byId[action.payload].stage], action.payload),
                    },
                    byProducer: _.omit(state.videoConsumers.byProducer, state.videoConsumers.byId[action.payload].videoProducer),
                    allIds: _.filter(state.videoConsumers.allIds, action.payload)
                }
            };
    }
    return state;
}