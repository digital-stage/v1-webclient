import {InitialNormalizedState, NormalizedState, OutsideStageNormalizedState} from "../../schema";
import {ServerDeviceEvents, ServerGlobalEvents, ServerStageEvents, ServerUserEvents} from "../../../common/events";
import {addItemToCollection, filter, removeItem, updateItem, upsert} from "../utils";
import {AnyAction, Reducer} from "redux";
import _ from "lodash";
import normalize from "../normalizer";
import {Stage} from "../../../common/model.server";
import {
    AudioConsumer,
    AudioProducer,
    CustomAudioProducer,
    CustomStageMember,
    Device,
    Group,
    StageMember,
    User, VideoConsumer, VideoProducer
} from "../../model";

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

const stageReducer: Reducer<NormalizedState, ReducerAction> = (state: NormalizedState = InitialNormalizedState, action: ReducerAction): NormalizedState => {
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
                    ...addItemToCollection<Device>(state.devices, action.payload._id, action.payload),
                    local: action.payload._id,
                }
            }

        case ServerDeviceEvents.DEVICE_ADDED:
            return {
                ...state,
                devices: {
                    ...state.devices,
                    ...addItemToCollection<Device>(state.devices, action.payload._id, action.payload),
                    remote: upsert(state.devices.remote, action.payload._id)
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
            return {
                ...state,
                users: addItemToCollection<User>(state.users, action.payload._id, action.payload)
            }
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
            console.log("JOINED STAGE!");
            console.log(action.payload);
            return normalize(state, {
                ...action.payload,
                stages: action.payload.stage ? [action.payload.stage] : []
            })
        case ServerStageEvents.STAGE_LEFT:
            return {
                // Keep existing
                ready: state.ready,
                devices: state.devices,
                stages: state.stages,
                groups: state.groups,
                user: state.user,
                users: state.users,
                audioConsumers: state.audioConsumers,
                videoConsumers: state.videoConsumers,
                // Reset states:
                stageId: undefined,
                groupId: undefined,
                customGroups: {
                    byId: {},
                    byGroup: {},
                    allIds: []
                },
                stageMembers: {
                    byId: {},
                    byGroup: {},
                    byStage: {},
                    allIds: []
                },
                customStageMembers: {
                    byId: {},
                    byStageMember: {},
                    allIds: []
                },
                videoProducers: {
                    byId: {},
                    byStageMember: {},
                    allIds: []
                },
                audioProducers: {
                    byId: {},
                    byStageMember: {},
                    allIds: []
                },
                customAudioProducers: {
                    byId: {},
                    byAudioProducer: {},
                    allIds: []
                },
                ovTracks: {
                    byId: {},
                    byStageMember: {},
                    allIds: []
                },
                customOvTracks: {
                    byId: {},
                    byOvTrack: {},
                    allIds: []
                }
            };
        case ServerStageEvents.STAGE_ADDED:
            return {
                ...state,
                stages: {
                    ...state.stages,
                    byId: {
                        ...state.stages.byId,
                        [action.payload._id]: {
                            ...action.payload,
                            isAdmin: state.user && (action.payload as Stage).admins.find(adminId => adminId === state.user._id)
                        },
                    },
                    allIds: [...state.stages.allIds, action.payload._id]
                }
            }
        case ServerStageEvents.STAGE_CHANGED:
            return {
                ...state,
                stages: {
                    ...state.stages,
                    byId: {
                        ...state.stages.byId,
                        [action.payload._id]: {
                            ...state.stages.byId[action.payload._id],
                            ...action.payload,
                            isAdmin: state.user && state.stages.byId[action.payload._id].admins.find(adminId => adminId === state.user._id)
                        }
                    }
                }
            };
        case ServerStageEvents.STAGE_REMOVED:
            return {
                ...state,
                stages: {
                    ...state.stages,
                    byId: _.omit(state.stages.byId, action.payload),
                    allIds: filter(state.stages.allIds, action.payload)
                }
            };

        case ServerStageEvents.GROUP_ADDED:
            return {
                ...state,
                groups: {
                    ...addItemToCollection<Group>(state.groups, action.payload._id, action.payload),
                    byStage: {
                        ...state.groups.byStage,
                        [action.payload.stageId]: upsert(state.groups.byStage[action.payload.stageId], action.payload._id)
                    }
                }
            }
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
                        [state.groups.byId[action.payload].stageId]: filter(state.groups.byStage[state.groups.byId[action.payload].stageId], action.payload),
                    },
                    allIds: filter(state.groups.allIds, action.payload)
                }
            };

        case ServerStageEvents.STAGE_MEMBER_ADDED:
            return {
                ...state,
                stageMembers: {
                    ...addItemToCollection<StageMember>(state.stageMembers, action.payload._id, action.payload),
                    byStage: {
                        ...state.stageMembers.byStage,
                        [action.payload.stageId]: upsert(state.stageMembers.byStage[action.payload.stageId], action.payload._id)
                    },
                    byGroup: {
                        ...state.stageMembers.byGroup,
                        [action.payload.groupId]: upsert(state.stageMembers.byStage[action.payload.groupId], action.payload._id)
                    }
                }
            }
        case ServerStageEvents.STAGE_MEMBER_CHANGED:
            if (state.stageMembers.byId[action.payload._id]) {
                const oldGroupId = state.stageMembers.byId[action.payload._id].groupId;
                if (action.payload.groupId && oldGroupId !== action.payload.groupId) {
                    // Remove old byGroup entry
                    state.stageMembers.byGroup[oldGroupId] = filter(state.stageMembers.byGroup[oldGroupId], action.payload._id);
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
                        [state.stageMembers.byId[action.payload].stageId]: filter(state.stageMembers.byStage[state.stageMembers.byId[action.payload].stageId], action.payload),
                    },
                    byGroup: {
                        ...state.stageMembers.byGroup,
                        [state.stageMembers.byId[action.payload].groupId]: filter(state.stageMembers.byGroup[state.stageMembers.byId[action.payload].groupId], action.payload),
                    },
                    allIds: filter(state.stageMembers.allIds, action.payload)
                }
            };

        case ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED:
            return {
                ...state,
                customStageMembers: {
                    ...addItemToCollection<CustomStageMember>(state.customStageMembers, action.payload._id, action.payload),
                    byStageMember: {
                        ...state.customStageMembers.byStageMember,
                        [action.payload.stageMemberId]: upsert(state.customStageMembers.byStageMember[action.payload.stageMemberId], action.payload._id)
                    },
                }
            };
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
                        [state.customStageMembers.byId[action.payload].stageMemberId]: filter(state.customStageMembers.byStageMember[state.customStageMembers.byId[action.payload].stageMemberId], action.payload),
                    },
                    allIds: filter(state.stageMembers.allIds, action.payload)
                }
            };

        case ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED:
            return {
                ...state,
                audioProducers: {
                    ...addItemToCollection<AudioProducer>(state.audioProducers, action.payload._id, action.payload),
                    byStageMember: {
                        ...state.audioProducers.byStageMember,
                        [action.payload.stageMemberId]: action.payload._id,
                    },
                }
            };
        case ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED:
            return updateItem(state, "audioProducers", action.payload._id, action.payload);
        case ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED:
            console.log("STAGE_MEMBER_AUDIO_REMOVED");
            console.log(state.audioProducers.byId[action.payload])
            return {
                ...state,
                audioProducers: {
                    ...state.audioProducers,
                    byId: _.omit(state.audioProducers.byId, action.payload),
                    byStageMember: {
                        ...state.audioProducers.byStageMember,
                        [state.audioProducers.byId[action.payload].stageMemberId]: filter(state.audioProducers.byStageMember[state.audioProducers.byId[action.payload].stageMemberId], action.payload),
                    },
                    allIds: filter(state.stageMembers.allIds, action.payload)
                }
            };

        case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED:
            return {
                ...state,
                customAudioProducers: {
                    ...state.customAudioProducers,
                    ...addItemToCollection<CustomAudioProducer>(state.customAudioProducers, action.payload._id, action.payload),
                    byAudioProducer: {
                        ...state.customAudioProducers.byAudioProducer,
                        [action.payload.stageMemberAudioProducerId]: upsert(state.customAudioProducers.byAudioProducer[action.payload.stageMemberAudioProducerId], action.payload._id)
                    }
                }
            }
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
                        [state.customAudioProducers.byId[action.payload].stageMemberAudioProducerId]: filter(state.customAudioProducers.byAudioProducer[state.customAudioProducers.byId[action.payload].stageMemberAudioProducerId], action.payload),
                    },
                    allIds: filter(state.stageMembers.allIds, action.payload)
                }
            };

        case ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED:
            return {
                ...state,
                videoProducers: {
                    ...addItemToCollection<VideoProducer>(state.videoProducers, action.payload._id, action.payload),
                    byStageMember: {
                        ...state.videoProducers.byStageMember,
                        [action.payload.stageMemberId]: action.payload._id,
                    },
                }
            }
        case ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED:
            return updateItem(state, "videoProducers", action.payload._id, action.payload);
        case ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED:
            console.log("STAGE_MEMBER_VIDEO_REMOVED");
            console.log(state.videoProducers.byId[action.payload]);
            return {
                ...state,
                videoProducers: {
                    ...state.videoProducers,
                    byId: _.omit(state.videoProducers.byId, action.payload),
                    byStageMember: {
                        ...state.videoProducers.byStageMember,
                        [state.videoProducers.byId[action.payload].stageMemberId]: filter(state.videoProducers.byStageMember[state.videoProducers.byId[action.payload].stageMemberId], action.payload),
                    },
                    allIds: filter(state.stageMembers.allIds, action.payload)
                }
            };


        case AdditionalReducerTypes.ADD_AUDIO_CONSUMER:
            return {
                ...state,
                audioConsumers: {
                    ...addItemToCollection<AudioConsumer>(state.audioConsumers, action.payload._id, action.payload),
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
                    }
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
                        [state.audioConsumers.byId[action.payload].stageMember]: filter(state.audioConsumers.byStageMember[state.audioConsumers.byId[action.payload].stageMember], action.payload),
                    },
                    byStage: {
                        ...state.audioConsumers.byStage,
                        [state.audioConsumers.byId[action.payload].stage]: filter(state.audioConsumers.byStage[state.audioConsumers.byId[action.payload].stage], action.payload),
                    },
                    byProducer: _.omit(state.audioConsumers.byProducer, state.audioConsumers.byId[action.payload].audioProducer),
                    allIds: filter(state.audioConsumers.allIds, action.payload)
                }
            };


        case AdditionalReducerTypes.ADD_VIDEO_CONSUMER:
            return {
                ...state,
                videoConsumers: {
                    ...addItemToCollection<VideoConsumer>(state.videoConsumers, action.payload._id, action.payload),
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
                    }
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
                        [state.videoConsumers.byId[action.payload].stageMember]: filter(state.videoConsumers.byStageMember[state.videoConsumers.byId[action.payload].stageMember], action.payload),
                    },
                    byStage: {
                        ...state.videoConsumers.byStage,
                        [state.videoConsumers.byId[action.payload].stage]: filter(state.videoConsumers.byStage[state.videoConsumers.byId[action.payload].stage], action.payload),
                    },
                    byProducer: _.omit(state.videoConsumers.byProducer, state.videoConsumers.byId[action.payload].videoProducer),
                    allIds: filter(state.videoConsumers.allIds, action.payload)
                }
            };
    }
    return state;
}
export default stageReducer;