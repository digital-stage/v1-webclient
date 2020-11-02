import {InitialNormalizedState, NormalizedState, OutsideStageNormalizedState} from "../../schema";
import {ServerDeviceEvents, ServerGlobalEvents, ServerStageEvents, ServerUserEvents} from "../../../common/events";
import {addItemToCollection, filter, removeItem, updateItem, upsert} from "../utils";
import {AnyAction, Reducer} from "redux";
import _ from "lodash";
import {normalize} from "../normalizer";
import {Stage} from "../../../common/model.server";
import {
    CustomAudioProducer, CustomOvTrack,
    Device,
    StageMember,
    User
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

const stageReducer: Reducer<NormalizedState, ReducerAction> = (state: Readonly<NormalizedState> = InitialNormalizedState, action: ReducerAction): NormalizedState => {
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
                users: {
                    ...state.user,
                    ...addItemToCollection<User>(state.users, action.payload._id, action.payload)
                },
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
                    byId: {
                        ...state.devices.byId,
                        [action.payload._id]: action.payload
                    },
                    allIds: [...state.devices.allIds, action.payload._id],
                    remote: [...state.devices.remote, action.payload._id]
                }
            };
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
                users: {
                    ...state.users,
                    byId: {
                        ...state.users.byId,
                        [action.payload._id]: action.payload
                    },
                    allIds: [...state.devices.allIds, action.payload._id]
                }
            };
        case ServerStageEvents.USER_CHANGED:
            return updateItem(state, "users", action.payload._id, action.payload);
        case ServerStageEvents.USER_REMOVED:
            return {
                ...state,
                users: {
                    ...state.users,
                    byId: _.omit(state.users.byId, action.payload),
                    allIds: filter(state.users.allIds, action.payload)
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
                ...state,
                ...OutsideStageNormalizedState
            };
        //return InitialNormalizedState;
        case ServerStageEvents.STAGE_ADDED:
            return {
                ...state,
                stages: {
                    ...state.stages,
                    byId: {
                        ...state.stages.byId,
                        [action.payload._id]: {
                            ...action.payload,
                            isAdmin: state.user ? (action.payload as Stage).admins.indexOf(state.user._id) !== -1 : false
                        }
                    },
                    allIds: [...state.stages.allIds, action.payload._id]
                }
            };
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
                    allIds: _.filter(state.stages.allIds, id => id !== action.payload)
                }
            };

        case ServerStageEvents.GROUP_ADDED:
            return {
                ...state,
                groups: {
                    ...state.groups,
                    byId: {
                        ...state.groups.byId,
                        [action.payload._id]: action.payload
                    },
                    byStage: {
                        ...state.groups.byStage,
                        [action.payload.stageId]: upsert<string>(state.groups.byStage[action.payload.stageId], action.payload._id)
                    },
                    allIds: [...state.groups.allIds, action.payload._id]
                }
            };
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
                        [state.groups.byId[action.payload].stageId]: _.filter(state.groups.byStage[state.groups.byId[action.payload].stageId], id => id !== action.payload),
                    },
                    allIds: _.filter(state.groups.allIds, id => id !== action.payload)
                }
            };

        case ServerStageEvents.CUSTOM_GROUP_ADDED:
            return {
                ...state,
                customGroups: {
                    ...state.customGroups,
                    byId: {
                        ...state.customGroups.byId,
                        [action.payload._id]: action.payload
                    },
                    byGroup: {
                        ...state.customGroups.byGroup,
                        [action.payload.groupId]: action.payload._id
                    },
                    allIds: upsert(state.customGroups.allIds, action.payload._id)
                }
            };
        case ServerStageEvents.CUSTOM_GROUP_CHANGED:
            return {
                ...state,
                customGroups: {
                    ...state.customGroups,
                    byId: {
                        ...state.customGroups.byId,
                        [action.payload._id]: {
                            ...state.customGroups.byId[action.payload._id],
                            ...action.payload
                        }
                    }
                }
            };
        case ServerStageEvents.CUSTOM_GROUP_REMOVED:
            return {
                ...state,
                customGroups: {
                    ...state.customGroups,
                    byId: _.omit(state.customGroups.byId, action.payload),
                    byGroup: _.omit(state.customGroups.byGroup, state.customGroups.byId[action.payload].groupId),
                    allIds: _.filter(state.customGroups.allIds, id => id !== action.payload)
                }
            };

        case ServerStageEvents.STAGE_MEMBER_ADDED:
            return {
                ...state,
                stageMembers: {
                    ...state.stageMembers,
                    ...addItemToCollection<StageMember>(state.stageMembers, action.payload._id, action.payload),
                    byStage: {
                        ...state.stageMembers.byStage,
                        [action.payload.stageId]: upsert<string>(state.stageMembers.byStage[action.payload.stageId], action.payload._id)
                    },
                    byGroup: {
                        ...state.stageMembers.byGroup,
                        [action.payload.groupId]: upsert<string>(state.stageMembers.byStage[action.payload.groupId], action.payload._id)
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
                    state.stageMembers.byGroup[action.payload.groupId] = upsert<string>(state.stageMembers.byGroup[action.payload.groupId], action.payload._id);
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
                        [state.stageMembers.byId[action.payload].stageId]: _.filter(state.stageMembers.byStage[state.stageMembers.byId[action.payload].stageId], id => id !== action.payload),
                    },
                    byGroup: {
                        ...state.stageMembers.byGroup,
                        [state.stageMembers.byId[action.payload].groupId]: _.filter(state.stageMembers.byGroup[state.stageMembers.byId[action.payload].groupId], id => id !== action.payload),
                    },
                    allIds: _.filter(state.stageMembers.allIds, id => id !== action.payload)
                }
            };

        case ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED:
            return {
                ...state,
                customStageMembers: {
                    ...state.customStageMembers,
                    byId: {
                        ...state.customStageMembers.byId,
                        [action.payload._id]: action.payload
                    },
                    allIds: [...state.customStageMembers.allIds, action.payload._id],
                    byStageMember: {
                        ...state.customStageMembers.byStageMember,
                        [action.payload.stageMemberId]: action.payload._id
                    },
                }
            };
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED:
            return {
                ...state,
                customStageMembers: {
                    ...state.customStageMembers,
                    byId: {
                        ...state.customStageMembers.byId,
                        [action.payload._id]: {
                            ...state.customStageMembers.byId[action.payload._id],
                            ...action.payload
                        }
                    }
                }
            };
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED:
            return {
                ...state,
                customStageMembers: {
                    ...state.customStageMembers,
                    byId: _.omit(state.customStageMembers.byId, action.payload),
                    byStageMember: _.omit(state.customStageMembers.byStageMember, state.customStageMembers.byId[action.payload].stageMemberId),
                    allIds: _.filter(state.stageMembers.allIds, id => id !== action.payload)
                }
            };

        case ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED:
            return {
                ...state,
                audioProducers: {
                    ...state.audioProducers,
                    byId: {
                        ...state.audioProducers.byId,
                        [action.payload._id]: action.payload
                    },
                    byStage: {
                        ...state.audioProducers.byStage,
                        [action.payload.stageId]: upsert(state.audioProducers.byStage[action.payload.stageId], action.payload._id)
                    },
                    byStageMember: {
                        ...state.audioProducers.byStageMember,
                        [action.payload.stageMemberId]: upsert(state.audioProducers.byStageMember[action.payload.stageMemberId], action.payload._id)
                    },
                    allIds: [...state.audioProducers.allIds, action.payload._id],
                }
            };
        case ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED:
            return {
                ...state,
                audioProducers: {
                    ...state.audioProducers,
                    byId: {
                        ...state.audioProducers.byId,
                        [action.payload._id]: {
                            ...state.audioProducers.byId[action.payload._id],
                            ...action.payload
                        }
                    }
                }
            };
        case ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED:
            return {
                ...state,
                audioProducers: {
                    ...state.audioProducers,
                    byId: _.omit(state.audioProducers.byId, action.payload),
                    byStage: {
                        ...state.audioProducers.byStage,
                        [state.audioProducers.byId[action.payload].stageId]: _.filter(state.audioProducers.byStage[state.audioProducers.byId[action.payload].stageId], id => id !== action.payload)
                    },
                    byStageMember: {
                        ...state.audioProducers.byStageMember,
                        [state.audioProducers.byId[action.payload].stageMemberId]: _.filter(state.audioProducers.byStageMember[state.audioProducers.byId[action.payload].stageMemberId], id => id !== action.payload),
                    },
                    allIds: _.filter(state.audioProducers.allIds, id => id !== action.payload)
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
                        [action.payload.stageMemberAudioProducerId]: action.payload._id
                    }
                }
            }
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED:
            return {
                ...state,
                customAudioProducers: {
                    ...state.customAudioProducers,
                    byId: {
                        ...state.customAudioProducers.byId,
                        [action.payload._id]: {
                            ...state.customAudioProducers.byId[action.payload._id],
                            ...action.payload
                        }
                    }
                }
            };
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED:
            return {
                ...state,
                customAudioProducers: {
                    ...state.customAudioProducers,
                    byId: _.omit(state.customAudioProducers.byId, action.payload),
                    byAudioProducer: _.omit(state.customAudioProducers.byAudioProducer, state.audioConsumers.byId[action.payload].audioProducer),
                    allIds: _.filter(state.customAudioProducers.allIds, id => id !== action.payload)
                }
            };

        case ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED:
            return {
                ...state,
                videoProducers: {
                    ...state.videoProducers,
                    byId: {
                        ...state.videoProducers.byId,
                        [action.payload._id]: action.payload
                    },
                    byStage: {
                        ...state.videoProducers.byStage,
                        [action.payload.stageId]: upsert(state.videoProducers.byStage[action.payload.stageId], action.payload._id)
                    },
                    byStageMember: {
                        ...state.videoProducers.byStageMember,
                        [action.payload.stageMemberId]: upsert(state.videoProducers.byStageMember[action.payload.stageMemberId], action.payload._id),
                    },
                    allIds: [...state.videoProducers.allIds, action.payload._id],
                }
            }
        case ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED:
            return {
                ...state,
                videoProducers: {
                    ...state.videoProducers,
                    byId: {
                        ...state.videoProducers.byId,
                        [action.payload._id]: {
                            ...state.videoProducers.byId[action.payload._id],
                            ...action.payload
                        }
                    }
                }
            };
        case ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED:
            if (!state.videoProducers.byId[action.payload]) {
                console.error("Could not remove requested producer with id=" + action.payload);
                return state;
            }
            return {
                ...state,
                videoProducers: {
                    ...state.videoProducers,
                    byId: _.omit(state.videoProducers.byId, action.payload),
                    byStage: {
                        ...state.videoProducers.byStage,
                        [state.videoProducers.byId[action.payload].stageId]: _.filter(state.videoProducers.byStage[state.videoProducers.byId[action.payload].stageId], id => id !== action.payload)
                    },
                    byStageMember: {
                        ...state.videoProducers.byStageMember,
                        [state.videoProducers.byId[action.payload].stageMemberId]: _.filter(state.videoProducers.byStageMember[state.videoProducers.byId[action.payload].stageMemberId], id => id !== action.payload),
                    },
                    allIds: _.filter(state.videoProducers.allIds, id => id !== action.payload)
                }
            };
        case ServerStageEvents.STAGE_MEMBER_OV_ADDED:
            return {
                ...state,
                ovTracks: {
                    ...state.ovTracks,
                    byId: {
                        ...state.ovTracks.byId,
                        [action.payload._id]: action.payload
                    },
                    byStageMember: {
                        ...state.ovTracks.byStageMember,
                        [action.payload.stageMemberId]: upsert(state.ovTracks.byStageMember[action.payload.stageMemberId], action.payload._id)
                    },
                    allIds: [...state.ovTracks.allIds, action.payload._id],
                }
            };
        case ServerStageEvents.STAGE_MEMBER_OV_CHANGED:
            return {
                ...state,
                ovTracks: {
                    ...state.ovTracks,
                    byId: {
                        ...state.ovTracks.byId,
                        [action.payload._id]: {
                            ...state.ovTracks.byId[action.payload._id],
                            ...action.payload
                        }
                    }
                }
            };
        case ServerStageEvents.STAGE_MEMBER_OV_REMOVED:
            return {
                ...state,
                ovTracks: {
                    ...state.ovTracks,
                    byId: _.omit(state.ovTracks.byId, action.payload),
                    byStageMember: {
                        ...state.ovTracks.byStageMember,
                        [state.ovTracks.byId[action.payload].stageMemberId]: _.filter(state.ovTracks.byStageMember[state.ovTracks.byId[action.payload].stageMemberId], id => id !== action.payload),
                    },
                    allIds: _.filter(state.ovTracks.allIds, id => id !== action.payload)
                }
            };
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED:
            return {
                ...state,
                customOvTracks: {
                    ...state.customOvTracks,
                    ...addItemToCollection<CustomOvTrack>(state.customOvTracks, action.payload._id, action.payload),
                    byOvTrack: {
                        ...state.customOvTracks.byOvTrack,
                        [action.payload.stageMemberOvTrackId]: action.payload._id
                    }
                }
            }
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED:
            return {
                ...state,
                customOvTracks: {
                    ...state.customOvTracks,
                    byId: {
                        ...state.customOvTracks.byId,
                        [action.payload._id]: {
                            ...state.customAudioProducers.byId[action.payload._id],
                            ...action.payload
                        }
                    }
                }
            };
        case ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED:
            return {
                ...state,
                customOvTracks: {
                    ...state.customOvTracks,
                    byId: _.omit(state.customOvTracks.byId, action.payload),
                    byOvTrack: _.omit(state.customOvTracks.byOvTrack, state.customOvTracks.byId[action.payload].stageMemberOvTrackId),
                    allIds: _.filter(state.customOvTracks.allIds, id => id !== action.payload)
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
                        [action.payload.stage]: upsert<string>(state.audioConsumers.byStage[action.payload.stage], action.payload._id),
                    },
                    byStageMember: {
                        ...state.audioConsumers.byStageMember,
                        [action.payload.stageMember]: upsert<string>(state.audioConsumers.byStageMember[action.payload.stageMember], action.payload._id),
                    },
                    allIds: [...state.audioConsumers.allIds, action.payload._id]
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
                        [state.audioConsumers.byId[action.payload].stageMember]: _.filter(state.audioConsumers.byStageMember[state.audioConsumers.byId[action.payload].stageMember], id => id !== action.payload),
                    },
                    byStage: {
                        ...state.audioConsumers.byStage,
                        [state.audioConsumers.byId[action.payload].stage]: _.filter(state.audioConsumers.byStage[state.audioConsumers.byId[action.payload].stage], id => id !== action.payload),
                    },
                    byProducer: _.omit(state.audioConsumers.byProducer, state.audioConsumers.byId[action.payload].audioProducer),
                    allIds: _.filter(state.audioConsumers.allIds, id => id !== action.payload)
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
                        [action.payload.stage]: upsert<string>(state.videoConsumers.byStage[action.payload.stage], action.payload._id),
                    },
                    byStageMember: {
                        ...state.videoConsumers.byStageMember,
                        [action.payload.stageMember]: upsert<string>(state.videoConsumers.byStageMember[action.payload.stageMember], action.payload._id),
                    },
                    allIds: [...state.videoConsumers.allIds, action.payload._id],
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
                        [state.videoConsumers.byId[action.payload].stageMember]: _.filter(state.videoConsumers.byStageMember[state.videoConsumers.byId[action.payload].stageMember], id => id !== action.payload)
                    },
                    byStage: {
                        ...state.videoConsumers.byStage,
                        [state.videoConsumers.byId[action.payload].stage]: _.filter(state.videoConsumers.byStage[state.videoConsumers.byId[action.payload].stage], id => id !== action.payload)
                    },
                    byProducer: _.omit(state.videoConsumers.byProducer, state.videoConsumers.byId[action.payload].videoProducer),
                    allIds: _.filter(state.videoConsumers.allIds, id => id !== action.payload)
                }
            };
        default:
            console.error("NOT HANDLED: " + action.type)
            return state;
    }
}
export default stageReducer;