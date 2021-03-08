import {RemoteOvTrackId} from "./IdTypes";
import {CustomRemoteOvTrackVolume} from "./CustomRemoteOvTrackVolume";

export interface CustomRemoteOvTrackVolumeCollection {
    byId: {
        [id: string]: CustomRemoteOvTrackVolume;
    };
    byRemoteOvTrack: {
        [remoteOvTrackId: string]: RemoteOvTrackId;
    };
    allIds: string[];
}
