import { combineReducers } from 'redux';
import global from './global';
import devices from './devices';
import users from './users';
import stages from './stages';
import groups from './groups';
import customGroups from './customGroups';
import stageMembers from './stageMembers';
import customStageMembers from './customStageMembers';
import videoProducers from './videoProducers';
import audioProducers from './audioProducers';
import customAudioProducers from './customAudioProducers';
import videoConsumers from './videoConsumers';
import audioConsumers from './audioConsumers';
import { RootReducer } from '../../types';

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
});
