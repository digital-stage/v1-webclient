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
import {
  CustomGroupsCollection,
  CustomRemoteAudioProducersCollection,
  CustomStageMembersCollection,
  DevicesCollection,
  GlobalStore,
  GroupsCollection,
  LocalConsumersCollection,
  RemoteAudioProducersCollection,
  RemoteVideoProducersCollection,
  StageMembersCollection,
  StagesCollection,
  UsersCollection,
} from '../../types';

interface RootReducer {
  global: GlobalStore;
  devices: DevicesCollection;
  users: UsersCollection;
  stages: StagesCollection;
  groups: GroupsCollection;
  customGroups: CustomGroupsCollection;
  stageMembers: StageMembersCollection;
  customStageMembers: CustomStageMembersCollection;
  videoProducers: RemoteVideoProducersCollection;
  audioProducers: RemoteAudioProducersCollection;
  customAudioProducers: CustomRemoteAudioProducersCollection;
  videoConsumers: LocalConsumersCollection;
  audioConsumers: LocalConsumersCollection;
}

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
