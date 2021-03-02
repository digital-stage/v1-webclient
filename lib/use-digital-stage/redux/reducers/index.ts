import { combineReducers } from 'redux';
import global from './global';
import devices from './devices';
import users from './users';
import stages from './stages';
import groups from './groups';
import customGroups from './customGroups';
import stageMembers from './stageMembers';
import customStageMembers from './customStageMembers';
import videoProducers from './remoteVideoProducers';
import audioProducers from './remoteAudioProducers';
import customAudioProducers from './customRemoteAudioProducers';
import videoConsumers from './videoConsumers';
import audioConsumers from './audioConsumers';
import { RootReducer } from '../../types';
import soundCards from './soundCards';
import chatMessages from './chatMessages';
import ovTracks from "./ovTracks";
import customRemoteOvTracks from "./customRemoteOvTracks";
import remoteOvTracks from "./remoteOvTracks";

export default combineReducers<RootReducer>({
  global,
  devices,
  users,
  stages,
  groups,
  customGroups,
  stageMembers,
  customStageMembers,
  videoProducers,
  audioProducers,
  customAudioProducers,
  videoConsumers,
  audioConsumers,
  ovTracks,
  remoteOvTracks,
  customRemoteOvTracks,
  soundCards,
  chatMessages,
});
