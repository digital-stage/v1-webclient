import {CustomRemoteOvTrackPosition} from "./CustomRemoteOvTrackPosition";
import {RemoteOvTrackId} from "./IdTypes";

export interface CustomRemoteOvTrackPositionCollection {
    byId: {
        [id: string]: CustomRemoteOvTrackPosition;
    };
    byRemoteOvTrack: {
        [remoteOvTrackId: string]: RemoteOvTrackId;
    };
    allIds: string[];
}
