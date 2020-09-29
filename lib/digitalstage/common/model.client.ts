import {Producer} from "./model.common";
import Server from "./model.server";
import mediasoupClient from "mediasoup-client";

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

    export type RemoteProducer = Producer;

    export interface LocalConsumer {
        remoteProducer: RemoteProducer;
        msConsumer: mediasoupClient.types.Consumer;
    }

    export interface GroupMember extends Server.StageMember {
        customVolume?: number;
        videoConsumers: LocalConsumer[];
        audioConsumers: LocalConsumer[];
        ovProducers: Producer[];
    }
}

export default Client;