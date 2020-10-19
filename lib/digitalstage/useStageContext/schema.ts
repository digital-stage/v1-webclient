import {
    AudioConsumer,
    AudioProducer, CustomAudioProducer,
    CustomGroup, CustomOvTrack,
    CustomStageMember,
    Device,
    Group,
    LocalUser, OvTrack,
    Stage,
    StageMember,
    User, VideoConsumer,
    VideoProducer
} from './model';

export interface Devices {
    byId: {
        [id: string]: Device
    },
    local?: string;
    remote: string[];
    allIds: string[]
}

export interface Users {
    byId: {
        [id: string]: User
    },
    allIds: string[]
}

export interface Stages {
    byId: {
        [id: string]: Stage
    },
    allIds: string[]
}

export interface Groups {
    byId: {
        [id: string]: Group
    },
    byStage: {
        [stageId: string]: string[]
    },
    allIds: string[]
}

export interface CustomGroups {
    byId: {
        // Already have a relation to groupId inside
        [id: string]: CustomGroup
    },
    byGroup: {
        [groupId: string]: string
    }
    allIds: string[]
}

export interface StageMembers {
    byId: {
        // Already have a relation to userId inside
        [id: string]: StageMember
    },
    byStage: {
        [stageId: string]: string[]
    },
    byGroup: {
        [groupId: string]: string[]
    },
    allIds: string[]
}

export interface CustomStageMembers {
    byId: {
        // Already have a relation to userId inside
        [id: string]: CustomStageMember
    },
    byStageMember: {
        [stageMemberId: string]: string
    },
    allIds: string[]
}

export interface VideoProducers {
    byId: {
        [id: string]: VideoProducer
    },
    byStage: {
        [stageId: string]: string[]
    },
    byStageMember: {
        [stageMemberId: string]: string[]
    },
    allIds: string[]
}

export interface AudioProducers {
    byId: {
        [id: string]: AudioProducer
    },
    byStage: {
        [stageId: string]: string[]
    },
    byStageMember: {
        [stageMemberId: string]: string[]
    },
    allIds: string[]
}

export interface CustomAudioProducers {
    byId: {
        [id: string]: CustomAudioProducer
    },
    byAudioProducer: {
        [audioProducerId: string]: string[]
    },
    allIds: string[]
}

export interface OvTracks {
    byId: {
        [id: string]: OvTrack
    },
    byStageMember: {
        [stageMemberId: string]: string[]
    },
    allIds: string[]
}

export interface CustomOvTracks {
    byId: {
        [id: string]: CustomOvTrack
    },
    byOvTrack: {
        [ovTrack: string]: string[]
    },
    allIds: string[]
}

export interface AudioConsumers {
    byId: {
        [id: string]: AudioConsumer
    },
    byProducer: {
        [audioProducerId: string]: string
    },
    byStage: {
        [stageId: string]: string[]
    },
    byStageMember: {
        [stageMemberId: string]: string[]
    },
    allIds: string[]
}

export interface VideoConsumers {
    byId: {
        [id: string]: VideoConsumer
    },
    byProducer: {
        [videoProducerId: string]: string
    },
    byStage: {
        [stageId: string]: string[]
    },
    byStageMember: {
        [stageMemberId: string]: string[]
    },
    allIds: string[]
}

export interface NormalizedState {
    ready: boolean;
    user?: LocalUser;
    stageId?: string;
    groupId?: string;
    devices: Devices;
    users: Users,
    stages: Stages,
    groups: Groups,
    customGroups: CustomGroups,
    stageMembers: StageMembers,
    customStageMembers: CustomStageMembers,
    videoProducers: VideoProducers,
    audioProducers: AudioProducers,
    customAudioProducers: CustomAudioProducers,
    ovTracks: OvTracks,
    customOvTracks: CustomOvTracks,
    audioConsumers: AudioConsumers,
    videoConsumers: VideoConsumers
}

export const OutsideStageNormalizedState: Partial<NormalizedState> = {
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
        byStage: {},
        allIds: []
    },
    audioProducers: {
        byId: {},
        byStageMember: {},
        byStage: {},
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
}

export const InitialNormalizedState: NormalizedState = {
    ready: false,
    stageId: undefined,
    groupId: undefined,
    devices: {
        byId: {},
        remote: [],
        allIds: []
    },
    users: {
        byId: {},
        allIds: []
    },
    stages: {
        byId: {},
        allIds: []
    },
    groups: {
        byId: {},
        byStage: {},
        allIds: []
    },
    customGroups: {
        byId: {},
        byGroup: {},
        allIds: []
    },
    stageMembers: {
        byId: {},
        byStage: {},
        byGroup: {},
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
        byStage: {},
        allIds: []
    },
    audioProducers: {
        byId: {},
        byStageMember: {},
        byStage: {},
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
    },
    videoConsumers: {
        byId: {},
        byStage: {},
        byProducer: {},
        byStageMember: {},
        allIds: []
    },
    audioConsumers: {
        byId: {},
        byProducer: {},
        byStage: {},
        byStageMember: {},
        allIds: []
    }
}