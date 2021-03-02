import {RemoteOvTrack} from "./RemoteOvTrack";

export interface RemoteOvTrackCollection {
    byId: {
        [id: string]: RemoteOvTrack;
    };
    byStageMember: {
        [stageMemberId: string]: string[];
    };
    byStage: {
        [stageId: string]: string[];
    };
    allIds: string[];
}
