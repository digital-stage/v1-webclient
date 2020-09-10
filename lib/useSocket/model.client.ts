import {
    CustomGroupVolumeId,
    CustomStageMemberVolumeId,
    GroupId, Producer,
    StageId,
    StageMemberId,
    UserId
} from "./model.common";

namespace Client {
    export interface StagePrototype {
        _id: StageId;
        name: string;

        password: string | null;

        // 3D Room specific
        width: number;
        length: number;
        height: number;
        absorption: number;
        reflection: number;
    }

    export interface GroupPrototype {
        _id: GroupId;
        name: string;
        stageId: string;
        volume: number;
    }

    export interface StageMemberPrototype {
        _id: StageMemberId;
        stageId: StageId;
        groupId: GroupId;
        isDirector: boolean;
        userId: UserId;
        name?: string;
        avatarUrl?: string | null;
        volume: number;
        x: number;
        y: number;
        z: number;
    }

    export interface CustomGroupVolume {
        _id: CustomGroupVolumeId;
        userId: UserId;
        stageId: StageId;
        groupId: GroupId;
        volume: number;
    }

    export interface CustomStageMemberVolume {
        _id: CustomStageMemberVolumeId;
        userId: UserId;
        stageId: StageId;
        stageMemberId: StageMemberId;
        volume: number;
    }

    export interface Stage extends StagePrototype {
        groups: Group[];
    }

    export interface Group extends GroupPrototype {
        members: GroupMember[];
    }

    export interface GroupMember extends StageMemberPrototype {
        videoProducers: Producer[];
        audioProducers: Producer[];
        ovProducers: Producer[];
    }
}

export default Client;