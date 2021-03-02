import {CustomRemoteOvTrack} from "./CustomRemoteOvTrack";
import {RemoteOvTrackId} from "./IdTypes";

export interface CustomRemoteOvTrackCollection {
    byId: {
        [id: string]: CustomRemoteOvTrack;
    };
    byRemoteOvTrack: {
        [remoteOvTrackId: string]: RemoteOvTrackId;
    };
    allIds: string[];
}
