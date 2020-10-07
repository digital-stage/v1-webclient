import * as Server from "./model.server";
import mediasoupClient from "mediasoup-client";

export namespace Client {
    /**
     * Create different components:
     *
     * - StageView (only consuming stage, but have group component)
     * - GroupsListView (only consuming groups)
     * - GroupView (only consuming stage members)
     * - StageMemberView (only consuming stage member, custom stage member and further)
     */
    export interface Stage extends Server.Stage {
        isAdmin: boolean;
    }

    export type Group = Server.Group;

    export interface StageMemberAudio extends Server.StageMemberAudioProducer {
        msConsumer?: mediasoupClient.types.Consumer;
    }

    export interface StageMemberVideo extends Server.StageMemberVideoProducer {
        msConsumer?: mediasoupClient.types.Consumer;
    }

    export type StageMemberOvTrack = Server.StageMemberOvTrack;

    export interface StageMember extends Server.StageMember {
        customVolume?: number;
        videoConsumers: StageMemberVideo[];
        audioConsumers: StageMemberAudio[];
        ovTracks: StageMemberOvTrack[];
    }

    export interface LocalAudioProducer extends Server.GlobalAudioProducer {
        msProducer: mediasoupClient.types.Producer;
    }

    export interface LocalVideoProducer extends Server.GlobalAudioProducer {
        msProducer: mediasoupClient.types.Producer;
    }
}

namespace ClientModel {
    export interface Stage extends Client.Stage {
        groups: Group[];
    }

    export interface Group extends Client.Group {
        customVolume?: number;
        members: StageMember[];
    }

    export interface StageMember extends Client.StageMember {
        name: string;
        avatarUrl?: string;
        customVolume?: number;
    }
}

export default ClientModel;