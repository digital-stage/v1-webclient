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
    stageId?: string;
    groupId?: string;
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
        byStage: {
            [stageId: string]: string[]
        },
        allIds: string[]
    },
    customGroups: {
        byId: {
            // Already have a relation to groupId inside
            [id: string]: CustomGroup
        },
        byGroup: {
            [groupId: string]: string[]
        }
        allIds: string[]
    },
    stageMembers: {
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
    },
    customStageMembers: {
        byId: {
            // Already have a relation to userId inside
            [id: string]: CustomStageMember
        },
        byStageMember: {
            [stageMemberId: string]: string[]
        },
        allIds: string[]
    },
    videoProducers: {
        byId: {
            [id: string]: VideoProducer
        },
        byStageMember: {
            [stageMemberId: string]: string[]
        },
        allIds: string[]
    },
    audioProducers: {
        byId: {
            [id: string]: AudioProducer
        },
        byStageMember: {
            [stageMemberId: string]: string[]
        },
        allIds: string[]
    },
    customAudioProducers: {
        byId: {
            [id: string]: CustomAudioProducer
        },
        byAudioProducer: {
            [audioProducerId: string]: string[]
        },
        allIds: string[]
    },
    ovTracks: {
        byId: {
            [id: string]: OvTrack
        },
        byStageMember: {
            [stageMemberId: string]: string[]
        },
        allIds: string[]
    },
    customOvTracks: {
        byId: {
            [id: string]: CustomOvTrack
        },
        byOvTrack: {
            [ovTrack: string]: string[]
        },
        allIds: string[]
    },
    audioConsumers: {
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
    },
    videoConsumers: {
        byId: {
            [id: string]: VideoConsumer
        },
        byProducer: {
            [videoProducerId: string]: string[]
        },
        byStageMember: {
            [stageMemberId: string]: string[]
        },
        allIds: string[]
    }
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
    },
    videoConsumers: {
        byId: {},
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