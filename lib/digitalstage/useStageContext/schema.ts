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

export interface NormalizedState {
    ready: boolean;
    user?: LocalUser;
    devices: {
        byId: {
            [id: string]: Device
        },
        local?: string;
        remote: string[];
        allIds: string[]
    };
    current?: {
        stageId: string;
        groupId: string;
    },
    users: {
        byId: {
            [id: string]: User
        },
        allIds: string[]
    },
    stages: {
        byId: {
            [id: string]: Stage
        },
        allIds: string[]
    },
    groups: {
        byId: {
            [id: string]: Group
        },
        allIds: string[]
    },
    customGroups: {
        byId: {
            // Already have a relation to groupId inside
            [id: string]: CustomGroup
        },
        allIds: string[]
    },
    stageMembers: {
        byId: {
            // Already have a relation to userId inside
            [id: string]: StageMember
        },
        allIds: string[]
    },
    customStageMembers: {
        byId: {
            // Already have a relation to userId inside
            [id: string]: CustomStageMember
        },
        allIds: string[]
    },
    videoProducers: {
        byId: {
            [id: string]: VideoProducer
        },
        allIds: string[]
    },
    audioProducers: {
        byId: {
            [id: string]: AudioProducer
        },
        allIds: string[]
    },
    customAudioProducers: {
        byId: {
            [id: string]: CustomAudioProducer
        },
        allIds: string[]
    },
    ovTracks: {
        byId: {
            [id: string]: OvTrack
        },
        allIds: string[]
    },
    customOvTracks: {
        byId: {
            [id: string]: CustomOvTrack
        },
        allIds: string[]
    },
    audioConsumers: {
        byId: {
            [id: string]: AudioConsumer
        },
        allIds: string[]
    },
    videoConsumers: {
        byId: {
            [id: string]: VideoConsumer
        },
        allIds: string[]
    }
}

export const OutsideStageNormalizedState: Partial<NormalizedState> = {
    current: undefined,
    customGroups: {
        byId: {},
        allIds: []
    },
    stageMembers: {
        byId: {},
        allIds: []
    },
    customStageMembers: {
        byId: {},
        allIds: []
    },
    videoProducers: {
        byId: {},
        allIds: []
    },
    audioProducers: {
        byId: {},
        allIds: []
    },
    customAudioProducers: {
        byId: {},
        allIds: []
    },
    ovTracks: {
        byId: {},
        allIds: []
    },
    customOvTracks: {
        byId: {},
        allIds: []
    }
}

export const InitialNormalizedState: NormalizedState = {
    ready: false,
    current: undefined,
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
        allIds: []
    },
    customGroups: {
        byId: {},
        allIds: []
    },
    stageMembers: {
        byId: {},
        allIds: []
    },
    customStageMembers: {
        byId: {},
        allIds: []
    },
    videoProducers: {
        byId: {},
        allIds: []
    },
    audioProducers: {
        byId: {},
        allIds: []
    },
    customAudioProducers: {
        byId: {},
        allIds: []
    },
    ovTracks: {
        byId: {},
        allIds: []
    },
    customOvTracks: {
        byId: {},
        allIds: []
    },
    videoConsumers: {
        byId: {},
        allIds: []
    },
    audioConsumers: {
        byId: {},
        allIds: []
    }
}