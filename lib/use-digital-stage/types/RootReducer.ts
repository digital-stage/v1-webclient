import { GlobalStore } from './GlobalStore';
import { DevicesCollection } from './DevicesCollection';
import { GroupsCollection } from './GroupsCollection';
import { CustomGroupsCollection } from './CustomGroupsCollection';
import { StageMembersCollection } from './StageMembersCollection';
import { StagesCollection } from './StagesCollection';
import { UsersCollection } from './UsersCollection';
import { CustomStageMembersCollection } from './CustomStageMembersCollection';
import { RemoteVideoProducersCollection } from './RemoteVideoProducersCollection';
import { RemoteAudioProducersCollection } from './RemoteAudioProducersCollection';
import { CustomRemoteAudioProducersCollection } from './CustomRemoteAudioProducersCollection';
import { LocalConsumersCollection } from './LocalConsumersCollection';
import { TrackCollection } from './TrackCollection';
import { TrackPresetCollection } from './TrackPresetCollection';
import { SoundCardCollection } from './SoundCardCollection';

export interface RootReducer {
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
  tracks: TrackCollection;
  trackPresets: TrackPresetCollection;
  soundCards: SoundCardCollection;
}
