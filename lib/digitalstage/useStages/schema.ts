import * as Server from "../common/model.server";
import mediasoupClient from 'mediasoup-client';

export interface NormalizedState {
    users: {
        byId: {
            [id: string]: Server.Stage & { stageMembers: string[] }
        },
        allIds: string[]
    },
    stages: {
        byId: {
            [id: string]: Server.Stage & { groups: string[] }
        },
        allIds: string[]
    },
    groups: {
        byId: {
            [id: string]: Server.Group & { customGroup?: string }
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
            [id: string]: Server.StageMemberVideoProducer
        },
        allIds: string[]
    },
    audioProducers: {
        byId: {
            [id: string]: Server.StageMemberAudioProducer & { customAudioProducer?: string }
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
                videoProducer: string
                msConsumer: mediasoupClient.types.Consumer
            }
        },
        allIds: string[]
    },
    videoConsumers: {
        byId: {
            [id: string]: {
                audioProducer: string
                msConsumer: mediasoupClient.types.Consumer
            }
        },
        allIds: string[]
    }
}

export const OutsideStageNormalizedState: Partial<NormalizedState> = {
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

export const InitialNormalizedState: NormalizedState = {
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