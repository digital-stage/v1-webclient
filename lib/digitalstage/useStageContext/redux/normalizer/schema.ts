import { schema } from "normalizr";
import {
  AudioConsumer,
  AudioProducer,
  CustomAudioProducer,
  CustomGroup,
  CustomOvTrack,
  CustomStageMember,
  Device,
  Group,
  OvTrack,
  Stage,
  StageMember,
  User,
  VideoConsumer,
  VideoProducer,
} from "../../model";

const user = new schema.Entity<User>("users");

const device = new schema.Entity<Device>(
  "devices",
  {
    user,
  },
  { idAttribute: "_id" }
);

const audioConsumer = new schema.Entity<AudioConsumer>(
  "audioConsumers",
  {},
  { idAttribute: "_id" }
);

const videoConsumer = new schema.Entity<VideoConsumer>(
  "audioConsumers",
  {},
  { idAttribute: "_id" }
);

const audioProducer = new schema.Entity<AudioProducer>(
  "audioProducers",
  {},
  { idAttribute: "_id" }
);

const customAudioProducer = new schema.Entity<CustomAudioProducer>(
  "customAudioProducers",
  {
    audioProducer,
  },
  { idAttribute: "_id" }
);

const videoProducer = new schema.Entity<VideoProducer>(
  "videoProducers",
  {},
  { idAttribute: "_id" }
);

const ovTrack = new schema.Entity<OvTrack>(
  "ovTracks",
  {},
  { idAttribute: "_id" }
);

const customOvTrack = new schema.Entity<CustomOvTrack>(
  "customOvTracks",
  {
    ovTrack,
  },
  { idAttribute: "_id" }
);

const customStageMember = new schema.Entity<CustomStageMember>(
  "groups",
  {},
  { idAttribute: "_id" }
);

const stageMember = new schema.Entity<StageMember>(
  "groups",
  {
    user,
    audioProducer: [audioProducer],
    videoProducer: [videoProducer],
    ovTracks: [ovTrack],
    audioConsumers: [audioConsumer],
    videoConsumers: [videoConsumer],
  },
  { idAttribute: "_id" }
);

const customGroup = new schema.Entity<CustomGroup>(
  "customGroups",
  {},
  { idAttribute: "_id" }
);

const group = new schema.Entity<Group>(
  "groups",
  {
    stageMembers: [stageMember],
    customGroup,
  },
  { idAttribute: "_id" }
);

const stage = new schema.Entity<Stage>(
  "stages",
  {
    admins: [user],
    groups: [group],
    stageMembers: [stageMember],
    audioProducers: [audioProducer],
    videoProducers: [videoProducer],
    ovTrack: [ovTrack],
    audioConsumers: [audioConsumer],
    videoConsumers: [videoConsumer],
  },
  { idAttribute: "_id" }
);

export interface StoreSchema {
  ready: boolean;
  user?: schema.Entity<User>;
  users: schema.Entity<User>[];
  devices: schema.Entity<Device>[];
  stageId?: string;
  groupId?: string;
  stages: schema.Entity<Stage>[];
  groups: schema.Entity<Group>[];
  customGroups: schema.Entity<CustomGroup>[];
  stageMembers: schema.Entity<StageMember>[];
  customStageMembers: schema.Entity<CustomStageMember>[];
  videoProducers: schema.Entity<VideoProducer>[];
  audioProducers: schema.Entity<AudioProducer>[];
  customAudioProducers: schema.Entity<CustomAudioProducer>[];
  ovTracks: schema.Entity<OvTrack>[];
  customOvTracks: schema.Entity<CustomOvTrack>[];
  audioConsumers: schema.Entity<AudioConsumer>[];
  videoConsumers: schema.Entity<VideoConsumer>[];
}

const storeSchema: StoreSchema = {
  ready: false,
  user,
  users: [user],
  devices: [device],
  stages: [stage],
  groups: [group],
  customGroups: [customGroup],
  stageMembers: [stageMember],
  customStageMembers: [customStageMember],
  videoProducers: [videoProducer],
  audioProducers: [audioProducer],
  customAudioProducers: [customAudioProducer],
  ovTracks: [ovTrack],
  customOvTracks: [customOvTrack],
  audioConsumers: [audioConsumer],
  videoConsumers: [videoConsumer],
};

export default storeSchema;

export {
  user,
  device,
  stage,
  group,
  customGroup,
  stageMember,
  customStageMember,
  videoProducer,
  audioProducer,
  customAudioProducer,
  ovTrack,
  customOvTrack,
  audioConsumer,
  videoConsumer,
};
