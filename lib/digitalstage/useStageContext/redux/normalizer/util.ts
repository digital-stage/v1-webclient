import {NormalizedState} from "../../schema";
import {upsert} from "../utils";
import merge from 'lodash/merge'
import {
    CustomGroup,
    CustomStageMember,
    Group,
    StageMember,
    User,
    Stage, CustomAudioProducer, CustomOvTrack, AudioProducer, VideoProducer, OvTrack
} from "../../model";

function normalize(prevState: Readonly<NormalizedState>, data: Partial<{
    stageId?: string;
    groupId?: string;
    users: User[];
    stages: Stage[];
    groups: Group[];
    stageMembers: StageMember[];
    customGroups: CustomGroup[];
    customStageMembers: CustomStageMember[];
    videoProducers: VideoProducer[];
    audioProducers: AudioProducer[];
    customAudioProducers: CustomAudioProducer[];
    ovTracks: OvTrack[];
    customOvTracks: CustomOvTrack[];
}>): NormalizedState {
    let state: NormalizedState = {
        ...prevState,
    }
    if (data.stageId && data.groupId) {
        state.stageId = data.stageId;
        state.groupId = data.groupId;
    }

    if (data.users) {
        data.users.forEach(user => {
            state = merge({}, state, {
                users: {
                    byId: {
                        [user._id]: user
                    },
                    allIds: [user._id]
                }
            })
        })
    }

    if (data.stages) {
        data.stages.forEach(stage => {
            state = {
                ...state,
                stages: {
                    ...state.stages,
                    byId: {
                        ...state.stages.byId,
                        [stage._id]: {
                            ...stage,
                            isAdmin: state.user ? stage.admins.indexOf(state.user._id) !== -1 :  false
                        }
                    },
                    allIds: [...state.stages.allIds, stage._id]
                }
            };
        })
    }

    if (data.groups) {
        data.groups.forEach(group => {
            state = {
                ...state,
                groups: {
                    ...state.groups,
                    byId: {
                        ...state.groups.byId,
                        [group._id]: group
                    },
                    byStage: {
                        ...state.groups.byStage,
                        [group.stageId]: upsert<string>(state.groups.byStage[group.stageId], group._id)
                    },
                    allIds: [...state.groups.allIds, group._id]
                }
            };
        })
    }

    if (data.customGroups) {
        data.customGroups.forEach(customGroup => {
            state = {
                ...state,
                customGroups: {
                    ...state.customGroups,
                    byId: {
                        ...state.customGroups.byId,
                        [customGroup._id]: customGroup
                    },
                    byGroup: {
                        ...state.customGroups.byGroup,
                        [customGroup.groupId]: customGroup._id
                    },
                    allIds: [...state.customGroups.allIds, customGroup._id]
                }
            };
        })
    }

    if (data.stageMembers) {
        data.stageMembers.forEach(stageMember => {
            state = {
                ...state,
                stageMembers: {
                    ...state.stageMembers,
                    byId: {
                        ...state.stageMembers.byId,
                        [stageMember._id]: stageMember
                    },
                    byStage: {
                        ...state.stageMembers.byStage,
                        [stageMember.stageId]: upsert<string>(state.stageMembers.byStage[stageMember.stageId], stageMember._id)
                    },
                    byGroup: {
                        ...state.stageMembers.byGroup,
                        [stageMember.groupId]: upsert<string>(state.stageMembers.byGroup[stageMember.groupId], stageMember._id)
                    },
                    allIds: [...state.stageMembers.allIds, stageMember._id]
                }
            };
        })
    }

    if (data.customStageMembers) {
        data.customStageMembers.forEach(customStageMember => {
            state = {
                ...state,
                customStageMembers: {
                    ...state.customStageMembers,
                    byId: {
                        ...state.customStageMembers.byId,
                        [customStageMember._id]: customStageMember
                    },
                    byStageMember: {
                        ...state.customStageMembers.byStageMember,
                        [customStageMember.stageMemberId]: customStageMember._id
                    },
                    allIds: [...state.stageMembers.allIds, customStageMember._id]
                }
            };
        })
    }

    if (data.videoProducers) {
        data.videoProducers.forEach(videoProducer => {
            state = {
                ...state,
                videoProducers: {
                    ...state.videoProducers,
                    byId: {
                        ...state.videoProducers.byId,
                        [videoProducer._id]: videoProducer
                    },
                    byStage: {
                        ...state.videoProducers.byStage,
                        [videoProducer.stageId]: upsert<string>(state.videoProducers.byStage[videoProducer.stageId], videoProducer._id)
                    },
                    byStageMember: {
                        ...state.videoProducers.byStageMember,
                        [videoProducer.stageMemberId]: upsert<string>(state.videoProducers.byStageMember[videoProducer.stageMemberId], videoProducer._id)
                    },
                    allIds: [...state.videoProducers.allIds, videoProducer._id]
                }
            };
        })
    }

    if (data.audioProducers) {
        data.audioProducers.forEach(audioProducer => {
            state = {
                ...state,
                audioProducers: {
                    ...state.audioProducers,
                    byId: {
                        ...state.audioProducers.byId,
                        [audioProducer._id]: audioProducer
                    },
                    byStage: {
                        ...state.audioProducers.byStage,
                        [audioProducer.stageId]: upsert<string>(state.audioProducers.byStage[audioProducer.stageId], audioProducer._id)
                    },
                    byStageMember: {
                        ...state.audioProducers.byStageMember,
                        [audioProducer.stageMemberId]: upsert<string>(state.audioProducers.byStageMember[audioProducer.stageMemberId], audioProducer._id)
                    },
                    allIds: [...state.audioProducers.allIds, audioProducer._id]
                }
            };
        })
    }

    if (data.customAudioProducers) {
        data.customAudioProducers.forEach(customAudioProducer => {
            state = {
                ...state,
                customAudioProducers: {
                    ...state.customAudioProducers,
                    byId: {
                        ...state.customAudioProducers.byId,
                        [customAudioProducer._id]: customAudioProducer
                    },
                    byAudioProducer: {
                        ...state.customAudioProducers.byAudioProducer,
                        [customAudioProducer.stageMemberAudioProducerId]: customAudioProducer._id
                    },
                    allIds: [...state.customAudioProducers.allIds, customAudioProducer._id]
                }
            };
        })
    }

    if (data.ovTracks) {
        data.ovTracks.forEach(ovTrack => {
            state = {
                ...state,
                ovTracks: {
                    ...state.ovTracks,
                    byId: {
                        ...state.ovTracks.byId,
                        [ovTrack._id]: ovTrack
                    },
                    byStageMember: {
                        ...state.ovTracks.byStageMember,
                        [ovTrack.stageMemberId]: upsert<string>(state.ovTracks.byStageMember[ovTrack.stageMemberId], ovTrack._id)
                    },
                    allIds: [...state.ovTracks.allIds, ovTrack._id]
                }
            };
        })
    }

    if (data.customOvTracks) {
        data.customOvTracks.forEach(customOvTrack => {
            state = {
                ...state,
                customOvTracks: {
                    ...state.customOvTracks,
                    byId: {
                        ...state.customOvTracks.byId,
                        [customOvTrack._id]: customOvTrack
                    },
                    byOvTrack: {
                        ...state.customOvTracks.byOvTrack,
                        [customOvTrack.stageMemberOvTrackId]: customOvTrack._id
                    },
                    allIds: [...state.customOvTracks.allIds, customOvTrack._id]
                }
            };
        })
    }

    return state;
}

export default normalize;