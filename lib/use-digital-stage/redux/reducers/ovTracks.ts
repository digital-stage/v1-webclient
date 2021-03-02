import omit from 'lodash/omit';
import { ServerDeviceEvents } from '../../global/SocketEvents';
import upsert from '../utils/upsert';
import {OvTrack} from "../../types/OvTrack";
import {OvTrackCollection} from "../../types/OvTrackCollection";

export type TrackAction =
  | { type: ServerDeviceEvents.TRACK_ADDED; payload: OvTrack }
  | { type: ServerDeviceEvents.TRACK_CHANGED; payload: OvTrack }
  | { type: ServerDeviceEvents.TRACK_REMOVED; payload: string };


function ovTracks(
  state: OvTrackCollection = {
    byId: {},
    bySoundCard: {},
    allIds: [],
  },
  action: TrackAction
): OvTrackCollection {
  switch (action.type) {
    case ServerDeviceEvents.TRACK_ADDED: {
      const track: OvTrack = action.payload;
      return {
        byId: {
          ...state.byId,
          [track._id]: track,
        },
        bySoundCard: {
          ...state.bySoundCard,
          [track.soundCardId]: upsert<string>(
            state.bySoundCard[track.soundCardId] || [],
            track._id
          ),
        },
        allIds: upsert<string>(state.allIds, track._id),
      };
    }
    case ServerDeviceEvents.TRACK_CHANGED: {
      const track: OvTrack = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [track._id]: {
            ...state.byId[track._id],
            ...track,
          },
        },
      };
    }
    case ServerDeviceEvents.TRACK_REMOVED: {
      const removedId: string = action.payload;
      const track: OvTrack = state.byId[removedId];
      return {
        ...state,
        byId: omit(state.byId, removedId),
        bySoundCard: {
          ...state.bySoundCard,
          [track.soundCardId]: state.bySoundCard[track.soundCardId].filter(
            (id) => id !== removedId
          ),
        },
        allIds: state.allIds.filter((id) => id !== removedId),
      };
    }
    default:
      return state;
  }
}

export default ovTracks;
