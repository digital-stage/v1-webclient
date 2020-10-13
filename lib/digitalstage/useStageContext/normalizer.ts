import {
    CustomGroup,
    CustomStageMember,
    CustomStageMemberAudioProducer,
    CustomStageMemberOvTrack,
    Group,
    Stage,
    StageMember,
    StageMemberAudioProducer,
    StageMemberOvTrack,
    StageMemberVideoProducer,
    User
} from "../common/model.server";
import {NormalizedState} from "./schema";
import {upsert} from "./utils";

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
        state.stageId = data.stageId;
        state.groupId = data.groupId;
    }
    if (data.users) {
        data.users.forEach(user => {
            state.users.byId[user._id] = {
                ...state.users.byId[user._id],
                ...user
            };
            state.users.allIds = upsert(state.users.allIds, user._id);
        });
    }
    if (data.stages) {
        data.stages.forEach(stage => {
            state.stages.byId[stage._id] = {
                isAdmin: stage.admins.indexOf(state.user._id) !== -1,
                ...stage
            };
            state.stages.allIds = upsert(state.stages.allIds, stage._id);
        });
    }
    if (data.groups) {
        data.groups.forEach(group => {
            state.groups.byId[group._id] = {
                ...state.groups.byId[group._id],
                ...group
            };
            state.groups.byStage[group.stageId] = upsert(state.groups.byStage[group.stageId], group._id);
            state.groups.allIds = upsert(state.groups.allIds, group._id);
        });
    }
    if (data.customGroups) {
        data.customGroups.forEach(customGroup => {
            state.customGroups.byId[customGroup._id] = {
                ...state.customGroups.byId[customGroup._id],
                ...customGroup
            };
            state.customGroups.byGroup[customGroup.groupId] = upsert(state.customGroups.byGroup[customGroup.groupId], customGroup._id);
            state.customGroups.allIds = upsert(state.customGroups.allIds, customGroup._id);
        });
    }
    if (data.stageMembers) {
        data.stageMembers.forEach(stageMember => {
            state.stageMembers.byId[stageMember._id] = {
                ...state.stageMembers.byId[stageMember._id],
                ...stageMember
            };
            state.stageMembers.byGroup[stageMember.groupId] = upsert(state.stageMembers.byGroup[stageMember.groupId], stageMember._id);
            state.stageMembers.byStage[stageMember.stageId] = upsert(state.stageMembers.byStage[stageMember.stageId], stageMember._id);
            state.stageMembers.allIds = upsert(state.stageMembers.allIds, stageMember._id);
        });
    }
    if (data.customStageMembers) {
        data.customStageMembers.forEach(customStageMember => {
            state.customStageMembers.byId[customStageMember._id] = {
                ...state.customStageMembers.byId[customStageMember._id],
                ...customStageMember
            };
            state.customStageMembers.byStageMember[customStageMember.stageMemberId] = upsert(state.customStageMembers.byStageMember[customStageMember.stageMemberId], customStageMember._id);
            state.customStageMembers.allIds = upsert(state.customStageMembers.allIds, customStageMember._id);
        });
    }
    if (data.videoProducers) {
        data.videoProducers.forEach(videoProducer => {
            state.videoProducers.byId[videoProducer._id] = {
                ...state.videoProducers.byId[videoProducer._id],
                ...videoProducer
            };
            state.videoProducers.byStageMember[videoProducer.stageMemberId] = upsert(state.videoProducers.byStageMember[videoProducer.stageMemberId], videoProducer._id);
            state.videoProducers.allIds = upsert(state.videoProducers.allIds, videoProducer._id);
        });
    }
    if (data.audioProducers) {
        data.audioProducers.forEach(audioProducer => {
            state.audioProducers.byId[audioProducer._id] = {
                ...state.audioProducers.byId[audioProducer._id],
                ...audioProducer
            };
            state.audioProducers.byStageMember[audioProducer.stageMemberId] = upsert(state.audioProducers.byStageMember[audioProducer.stageMemberId], audioProducer._id);
            state.audioProducers.allIds = upsert(state.audioProducers.allIds, audioProducer._id);
        });
    }
    if (data.customAudioProducers) {
        data.customAudioProducers.forEach(customAudioProducer => {
            state.customAudioProducers.byId[customAudioProducer._id] = {
                ...state.customOvTracks.byId[customAudioProducer._id],
                ...customAudioProducer
            };
            state.customAudioProducers.byAudioProducer[customAudioProducer.stageMemberAudioProducerId] = upsert(state.customAudioProducers.byAudioProducer[customAudioProducer.stageMemberAudioProducerId], customAudioProducer._id);
            state.customAudioProducers.allIds = upsert(state.customAudioProducers.allIds, customAudioProducer._id);
        });
    }
    if (data.ovTracks) {
        data.ovTracks.forEach(ovTrack => {
            state.ovTracks.byId[ovTrack._id] = {
                ...state.ovTracks.byId[ovTrack._id],
                ...ovTrack
            };
            state.ovTracks.byStageMember[ovTrack.stageMemberId] = upsert(state.ovTracks.byStageMember[ovTrack.stageMemberId], ovTrack._id);
            state.ovTracks.allIds = upsert(state.ovTracks.allIds, ovTrack._id);
        });
    }
    if (data.customOvTracks) {
        data.customOvTracks.forEach(customOvTrack => {
            state.customOvTracks.byId[customOvTrack._id] = {
                ...state.customOvTracks.byId[customOvTrack._id],
                ...customOvTrack
            };
            state.customOvTracks.byOvTrack[customOvTrack.stageMemberOvTrackId] = upsert(state.customOvTracks.byOvTrack[customOvTrack.stageMemberOvTrackId], customOvTrack._id);
            state.customOvTracks.allIds = upsert(state.customOvTracks.allIds, customOvTrack._id);
        });
    }
    return state;
}
