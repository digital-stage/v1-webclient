import * as Server from "../common/model.server";
import mediasoupClient from 'mediasoup-client';
import {GlobalAudioProducer, GlobalVideoProducer} from "../common/model.server";

export interface NormalizedState {
    ready: boolean;
    user?: Server.User;
    devices: {
        byId: {
            [id: string]: Server.Device
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
            [id: string]: Server.User & { stageMembers: string[] }
        },
        allIds: string[]
    },
    stages: {
        byId: {
            [id: string]: Server.Stage & { isAdmin: boolean, groups: string[] }
        },
        allIds: string[]
    },
    groups: {
        byId: {
            [id: string]: Server.Group & { customGroup?: string, stageMembers: string[] }
        },
        allIds: string[]
    },
    customGroups: {
        byId: {
            // Already have a relation to groupId inside
            [id: string]: Server.CustomGroup
        },
        allIds: string[]
    },
    stageMembers: {
        byId: {
            // Already have a relation to userId inside
            [id: string]: Server.StageMember & { customStageMember?: string, audioProducers: string[], videoProducers: string[], ovTracks: string[] }
        },
        allIds: string[]
    },
    customStageMembers: {
        byId: {
            // Already have a relation to userId inside
            [id: string]: Server.CustomStageMember
        },
        allIds: string[]
    },
    videoProducers: {
        byId: {
            [id: string]: Server.StageMemberVideoProducer & { consumer?: string }
        },
        allIds: string[]
    },
    audioProducers: {
        byId: {
            [id: string]: Server.StageMemberAudioProducer & { customAudioProducer?: string, consumer?: string }
        },
        allIds: string[]
    },
    customAudioProducers: {
        byId: {
            [id: string]: Server.CustomStageMemberAudioProducer
        },
        allIds: string[]
    },
    ovTracks: {
        byId: {
            [id: string]: Server.StageMemberOvTrack & { customOvTrack?: string }
        },
        allIds: string[]
    },
    customOvTracks: {
        byId: {
            [id: string]: Server.CustomStageMemberOvTrack
        },
        allIds: string[]
    },
    audioConsumers: {
        byId: {
            [id: string]: {
                audioProducer: string
                msConsumer: mediasoupClient.types.Consumer
            }
        },
        allIds: string[]
    },
    videoConsumers: {
        byId: {
            [id: string]: {
                videoProducer: string
                msConsumer: mediasoupClient.types.Consumer
            }
        },
        allIds: string[]
    },
    localAudioProducers: {
        byId: {
            [id: string]: GlobalAudioProducer & {msProducer: mediasoupClient.types.Producer}
        },
        allIds: string[]
    },
    localVideoProducers: {
        byId: {
            [id: string]: GlobalVideoProducer & {msProducer: mediasoupClient.types.Producer}
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
    },
    localAudioProducers: {
        byId: {},
        allIds: []
    },
    localVideoProducers: {
        byId: {},
        allIds: []
    }
}