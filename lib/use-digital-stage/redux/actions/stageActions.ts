import { ServerStageEvents } from '../../global/SocketEvents';
import {
  Stage,
  User,
  Group,
  StageMember,
  RemoteVideoProducer,
  RemoteAudioProducer,
  RemoteOvTrack,
  LocalConsumer,
  CustomGroupPosition,
  CustomGroupVolume,
  CustomStageMemberVolume,
  CustomStageMemberPosition,
  CustomRemoteAudioProducerVolume,
  CustomRemoteAudioProducerPosition,
  CustomRemoteOvTrackVolume,
  CustomRemoteOvTrackPosition,
} from '../../types';
import AdditionalReducerTypes from './AdditionalReducerTypes';
import { ChatMessage } from '../../types/ChatMessages';

const messageSent = (message: ChatMessage) => {
  return {
    type: ServerStageEvents.MESSAGE_SENT,
    payload: message,
  };
};

const addRemoteUser = (user: User) => {
  return {
    type: ServerStageEvents.REMOTE_USER_ADDED,
    payload: user,

  };
};
const changeRemoteUser = (user: Partial<User>) => {
  return {
    type: ServerStageEvents.REMOTE_USER_CHANGED,
    payload: user,
  };
};
const removeRemoteUser = (userId: string) => {
  return {
    type: ServerStageEvents.REMOTE_USER_REMOVED,
    payload: userId,
  };
};
const addStage = (stage: Stage) => {
  return {
    type: ServerStageEvents.STAGE_ADDED,
    payload: stage,
  };
};
const changeStage = (stage: Partial<Stage>) => {
  return {
    type: ServerStageEvents.STAGE_CHANGED,
    payload: stage,
  };
};
const removeStage = (stageId: string) => {
  return {
    type: ServerStageEvents.STAGE_REMOVED,
    payload: stageId,
  };
};

const addGroup = (group: Group) => {
  return {
    type: ServerStageEvents.GROUP_ADDED,
    payload: group,
  };
};
const changeGroup = (group: Partial<Group>) => {
  return {
    type: ServerStageEvents.GROUP_CHANGED,
    payload: group,
  };
};
const removeGroup = (groupId: string) => {
  return {
    type: ServerStageEvents.GROUP_REMOVED,
    payload: groupId,
  };
};

const addCustomGroupVolume = (group: CustomGroupVolume) => {
  return {
    type: ServerStageEvents.CUSTOM_GROUP_VOLUME_ADDED,
    payload: group,
  };
};
const changeCustomGroupVolume = (group: Partial<CustomGroupVolume>) => {
  return {
    type: ServerStageEvents.CUSTOM_GROUP_VOLUME_CHANGED,
    payload: group,
  };
};
const removeCustomGroupVolume = (groupId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_GROUP_VOLUME_REMOVED,
    payload: groupId,
  };
};
const addCustomGroupPosition = (group: CustomGroupPosition) => {
  return {
    type: ServerStageEvents.CUSTOM_GROUP_POSITION_ADDED,
    payload: group,
  };
};
const changeCustomGroupPosition = (group: Partial<CustomGroupPosition>) => {
  return {
    type: ServerStageEvents.CUSTOM_GROUP_POSITION_CHANGED,
    payload: group,
  };
};
const removeCustomGroupPosition = (groupId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_GROUP_POSITION_REMOVED,
    payload: groupId,
  };
};

const addStageMember = (stageMember: StageMember) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_ADDED,
    payload: stageMember,
  };
};
const changeStageMember = (stageMember: Partial<StageMember>) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_CHANGED,
    payload: stageMember,
  };
};
const removeStageMember = (stageMemberId: string) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_REMOVED,
    payload: stageMemberId,
  };
};

const addCustomStageMemberVolume = (stageMember: CustomStageMemberVolume) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_VOLUME_ADDED,
    payload: stageMember,
  };
};
const changeCustomStageMemberVolume = (stageMember: Partial<CustomStageMemberVolume>) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_VOLUME_CHANGED,
    payload: stageMember,
  };
};
const removeCustomStageMemberVolume = (customStageMemberId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_VOLUME_REMOVED,
    payload: customStageMemberId,
  };
};
const addCustomStageMemberPosition = (stageMember: CustomStageMemberPosition) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_POSITION_ADDED,
    payload: stageMember,
  };
};
const changeCustomStageMemberPosition = (stageMember: Partial<CustomStageMemberPosition>) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_POSITION_CHANGED,
    payload: stageMember,
  };
};
const removeCustomStageMemberPosition = (customStageMemberId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_POSITION_REMOVED,
    payload: customStageMemberId,
  };
};

const addVideoProducer = (videoProducer: RemoteVideoProducer) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED,
    payload: videoProducer,
  };
};
const changeVideoProducer = (videoProducer: Partial<RemoteVideoProducer>) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED,
    payload: videoProducer,
  };
};
const removeVideoProducer = (videoProducerId: string) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED,
    payload: videoProducerId,
  };
};

const addAudioProducer = (audioProducer: RemoteAudioProducer) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED,
    payload: audioProducer,
  };
};
const changeAudioProducer = (audioProducer: Partial<RemoteAudioProducer>) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED,
    payload: audioProducer,
  };
};
const removeAudioProducer = (audioProducerId: string) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED,
    payload: audioProducerId,
  };
};

const addCustomAudioProducerVolume = (customAudioProducer: CustomRemoteAudioProducerVolume) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_VOLUME_ADDED,
    payload: customAudioProducer,
  };
};
const changeCustomAudioProducerVolume = (customAudioProducer: Partial<CustomRemoteAudioProducerVolume>) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_VOLUME_CHANGED,
    payload: customAudioProducer,
  };
};
const removeCustomAudioProducerVolume = (customAudioProducerId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_VOLUME_REMOVED,
    payload: customAudioProducerId,
  };
};
const addCustomAudioProducerPosition = (customAudioProducer: CustomRemoteAudioProducerPosition) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_POSITION_ADDED,
    payload: customAudioProducer,
  };
};
const changeCustomAudioProducerPosition = (customAudioProducer: Partial<CustomRemoteAudioProducerPosition>) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_POSITION_CHANGED,
    payload: customAudioProducer,
  };
};
const removeCustomAudioProducerPosition = (customAudioProducerId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_POSITION_REMOVED,
    payload: customAudioProducerId,
  };
};

const addOvTrack = (track: RemoteOvTrack) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_OV_ADDED,
    payload: track,
  };
};
const changeOvTrack = (track: Partial<RemoteOvTrack>) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_OV_CHANGED,
    payload: track,
  };
};
const removeOvTrack = (trackId: string) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_OV_REMOVED,
    payload: trackId,
  };
};

const addCustomOvTrackVolume = (customOvTrack: CustomRemoteOvTrackVolume) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_VOLUME_ADDED,
    payload: customOvTrack,
  };
};
const changeCustomOvTrackVolume = (customOvTrack: Partial<CustomRemoteOvTrackVolume>) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_VOLUME_CHANGED,
    payload: customOvTrack,
  };
};
const removeCustomOvTrackVolume = (customOvTrackId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_VOLUME_REMOVED,
    payload: customOvTrackId,
  };
};
const addCustomOvTrackPosition = (customOvTrack: CustomRemoteOvTrackPosition) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_ADDED,
    payload: customOvTrack,
  };
};
const changeCustomOvTrackPosition = (customOvTrack: Partial<CustomRemoteOvTrackPosition>) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_CHANGED,
    payload: customOvTrack,
  };
};
const removeCustomOvTrackPosition = (customOvTrackId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_REMOVED,
    payload: customOvTrackId,
  };
};

const addVideoConsumer = (videoConsumer: LocalConsumer) => {
  return {
    type: AdditionalReducerTypes.ADD_VIDEO_CONSUMER,
    payload: videoConsumer,
  };
};
const removeVideoConsumer = (videoConsumerId: string) => {
  return {
    type: AdditionalReducerTypes.REMOVE_VIDEO_CONSUMER,
    payload: videoConsumerId,
  };
};

const addAudioConsumer = (audioConsumer: LocalConsumer) => {
  return {
    type: AdditionalReducerTypes.ADD_AUDIO_CONSUMER,
    payload: audioConsumer,
  };
};
const removeAudioConsumer = (audioConsumerId: string) => {
  return {
    type: AdditionalReducerTypes.REMOVE_AUDIO_CONSUMER,
    payload: audioConsumerId,
  };
};

const server = {
  messageSent,
  addRemoteUser,
  changeRemoteUser,
  removeRemoteUser,
  addStage,
  changeStage,
  removeStage,
  addGroup,
  changeGroup,
  removeGroup,
  addCustomGroupVolume,
  changeCustomGroupVolume,
  removeCustomGroupVolume,
  addCustomGroupPosition,
  changeCustomGroupPosition,
  removeCustomGroupPosition,
  addStageMember,
  changeStageMember,
  removeStageMember,
  addCustomStageMemberVolume,
  changeCustomStageMemberVolume,
  removeCustomStageMemberVolume,
  addCustomStageMemberPosition,
  changeCustomStageMemberPosition,
  removeCustomStageMemberPosition,
  addVideoProducer,
  changeVideoProducer,
  removeVideoProducer,
  addAudioProducer,
  changeAudioProducer,
  removeAudioProducer,
  addCustomAudioProducerVolume,
  changeCustomAudioProducerVolume,
  removeCustomAudioProducerVolume,
  addCustomAudioProducerPosition,
  changeCustomAudioProducerPosition,
  removeCustomAudioProducerPosition,
  addOvTrack,
  changeOvTrack,
  removeOvTrack,
  addCustomOvTrackVolume,
  changeCustomOvTrackVolume,
  removeCustomOvTrackVolume,
  addCustomOvTrackPosition,
  changeCustomOvTrackPosition,
  removeCustomOvTrackPosition,
};
const client = {
  addVideoConsumer,
  removeVideoConsumer,
  addAudioConsumer,
  removeAudioConsumer,
};
const stageActions = {
  server,
  client,
};
export default stageActions;
