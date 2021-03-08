import { combineReducers } from 'redux';
import global from './global';
import devices from './devices';
import users from './users';
import stages from './stages';
import groups from './groups';
import stageMembers from './stageMembers';
import videoProducers from './remoteVideoProducers';
import audioProducers from './remoteAudioProducers';
import videoConsumers from './videoConsumers';
import audioConsumers from './audioConsumers';
import { RootReducer } from '../../types';
import soundCards from './soundCards';
import chatMessages from './chatMessages';
import ovTracks from "./ovTracks";
import remoteOvTracks from "./remoteOvTracks";
import customRemoteOvTrackPositions from "./customRemoteOvTrackPositions";
import customRemoteOvTrackVolumes from "./customRemoteOvTrackVolumes";
import customStageMemberPositions from "./customStageMemberPositions";
import customGroupVolumes from "./customGroupVolumes";
import customGroupPositions from "./customGroupPositions";
import customStageMemberVolumes from "./customStageMemberVolumes";
import customRemoteAudioProducerVolumes from "./customRemoteAudioProducerVolumes";
import customRemoteAudioProducerPositions from "./customRemoteAudioProducerPositions";

export default combineReducers<RootReducer>({
  global,
  devices,
  users,
  stages,
  groups,
  customGroupVolumes,
  customGroupPositions,
  stageMembers,
  customStageMemberVolumes,
  customStageMemberPositions,
  videoProducers,
  audioProducers,
  customRemoteAudioProducerVolumes,
  customRemoteAudioProducerPositions,
  videoConsumers,
  audioConsumers,
  ovTracks,
  remoteOvTracks,
  customRemoteOvTrackVolumes,
  customRemoteOvTrackPositions,
  soundCards,
  chatMessages,
});
