import {Producer} from "./model.common";
import Server from "./model.server";

namespace Client {
    export interface Stage extends Server.Stage {
        isAdmin: boolean;
        groups: Group[];
    }

    export interface Group extends Server.Group {
        customVolume?: number;
        members: GroupMember[];
    }

    export interface GroupMember extends Server.StageMember {
        customVolume?: number;
        videoProducers: Producer[];
        audioProducers: Producer[];
        ovProducers: Producer[];
    }
}

export default Client;