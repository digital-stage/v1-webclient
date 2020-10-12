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
            upsert(state.groups.byId[stageMember.groupId].stageMembers, stageMember._id);
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
            if (state.stageMembers.byId[videoProducer.stageMemberId])
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
            if (state.stageMembers.byId[audioProducer.stageMemberId])
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
            if (state.audioProducers.byId[customAudioProducer.stageMemberAudioProducerId])
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
