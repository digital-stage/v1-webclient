import {Producer} from "./model.common";
import * as Server from "./model.server";
import mediasoupClient from "mediasoup-client";

export namespace Client2 {
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

    export type StageMembers = Server.StageMember;

    export interface StageMemberAudio extends Server.StageMemberAudioProducer {
        consumer?: mediasoupClient.types.Consumer;
    }

    export interface StageMemberVideo extends Server.StageMemberVideoProducer {
        consumer?: mediasoupClient.types.Consumer;
    }

    export type StageMemberOvTrack = Server.StageMemberOvTrack;
}

namespace Client {
    export interface Stage extends Server.Stage {
        isAdmin: boolean;
        groups: Group[];
    }

    export interface Group extends Server.Group {
        customVolume?: number;
        members: GroupMember[];
    }

    export interface LocalProducer extends Producer {
        msProducer: mediasoupClient.types.Producer
    }

    export type RemoteAudioProducer = Server.StageMemberAudioProducer;
    export type RemoteVideoProducer = Server.StageMemberVideoProducer;
    export type RemoteOvTrack = Server.StageMemberOvTrack;

    export interface LocalVideoConsumer {
        remoteProducer: RemoteVideoProducer;
        msConsumer: mediasoupClient.types.Consumer;
    }

    export interface LocalAudioConsumer {
        remoteProducer: RemoteAudioProducer;
        msConsumer: mediasoupClient.types.Consumer;
    }


    export interface GroupMember extends Server.StageMember {
        customVolume?: number;
        videoConsumers: LocalVideoConsumer[];
        audioConsumers: LocalAudioConsumer[];
        ovTracks: RemoteOvTrack[];
    }
}

export default Client;