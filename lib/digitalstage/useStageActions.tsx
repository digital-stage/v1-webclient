import { useCallback } from 'react';
import {
  CustomStageMemberAudioProducerId,
  CustomStageMemberId,
  CustomStageMemberOvTrackId,
  Device,
  DeviceId,
  GroupId,
  StageId,
  StageMemberAudioProducerId,
  StageMemberId,
  StageMemberOvTrackId,
} from './common/model.server';
import * as Server from './common/model.server';
import { ThreeDimensionAudioProperties } from './common/model.utils';
import {
  AddGroupPayload,
  AddStagePayload,
  ChangeGroupPayload,
  ChangeStageMemberAudioProducerPayload,
  ChangeStageMemberOvTrackPayload,
  ChangeStageMemberPayload,
  ChangeStagePayload,
  JoinStagePayload,
  RemoveCustomGroupPayload,
  RemoveCustomStageMemberAudioPayload,
  RemoveCustomStageMemberOvPayload,
  RemoveCustomStageMemberPayload,
  SetCustomGroupPayload,
  SetCustomStageMemberAudioPayload,
  SetCustomStageMemberOvPayload,
  SetCustomStageMemberPayload,
} from './common/payloads';
import { ClientDeviceEvents, ClientStageEvents, ClientUserEvents } from './common/events';
import { useRequest } from '../useRequest';
import { useSocket } from './useStageContext';
import { NormalizedState } from './useStageContext/schema';
import { useSelector } from './useStageContext/redux';

export interface StageActionsProps {
  updateDevice(id: DeviceId, device: Partial<Device>);

  updateUser(name: string, avatarUrl?: string);

  // Always callable
  createStage(
    name: string,
    password: string | null,
    width?: number,
    length?: number,
    height?: number,
    reflection?: number,
    absorption?: number
  );

  joinStage(stageId: StageId, groupId: GroupId, password: string | null): Promise<void>;

  leaveStage();

  leaveStageForGood(id: StageId);

  // Customized group
  setCustomGroup(groupId: GroupId, volume: number, muted: boolean);

  removeCustomGroup(customGroupId: GroupId);

  setCustomStageMember(
    stageMemberId: StageMemberId,
    update: Partial<ThreeDimensionAudioProperties>
  );

  removeCustomStageMember(customStageMemberId: CustomStageMemberId);

  setCustomStageMemberAudio(
    stageMemberAudioId: StageMemberAudioProducerId,
    update: Partial<ThreeDimensionAudioProperties>
  );

  removeCustomStageMemberAudio(customStageMemberAudioId: CustomStageMemberAudioProducerId);

  setCustomStageMemberOv(
    stageMemberOvId: StageMemberOvTrackId,
    update: Partial<ThreeDimensionAudioProperties>
  );

  removeCustomStageMemberOv(customStageMemberOvId: CustomStageMemberOvTrackId);

  // Admin only
  updateStage(id: StageId, stage: Partial<Server.Stage>);

  removeStage(id: StageId);

  createGroup(stageId: StageId, name: string);

  updateGroup(id: GroupId, group: Partial<Server.Group>);

  removeGroup(id: GroupId);

  updateStageMember(
    id: StageMemberId,
    update: Partial<
      {
        isDirector: boolean;
      } & ThreeDimensionAudioProperties
    >
  );

  updateStageMemberAudio(
    id: StageMemberAudioProducerId,
    update: Partial<ThreeDimensionAudioProperties>
  );

  updateStageMemberOv(id: StageMemberOvTrackId, update: Partial<ThreeDimensionAudioProperties>);
}

const useStageActions = (): StageActionsProps => {
  const socket = useSocket();
  const stageId = useSelector<NormalizedState, string | undefined>((state) => state.stageId);
  const { setRequest } = useRequest();

  const updateDevice = useCallback(
    (deviceId: string, device: Partial<Omit<Device, '_id'>>) => {
      if (socket) {
        socket.emit(ClientDeviceEvents.UPDATE_DEVICE, {
          ...device,
          _id: deviceId,
        });
      } else {
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket]
  );

  const updateUser = useCallback(
    (name: string, avatarUrl?: string) => {
      if (socket) {
        socket.emit(ClientUserEvents.CHANGE_USER, {
          name,
          avatarUrl,
        });
      } else {
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket]
  );

  const createStage = useCallback(
    (
      name: string,
      password: string,
      width?: number,
      length?: number,
      height?: number,
      reflection?: number,
      absorption?: number
    ) => {
      if (socket) {
        const payload: AddStagePayload = {
          name,
          password,
          width: width || 25,
          length: length || 13,
          height: height || 7.5,
          damping: reflection || 0.7,
          absorption: absorption || 0.6,
        };
        socket.emit(ClientStageEvents.ADD_STAGE, payload);
      }
    },
    [socket]
  );

  const updateStage = useCallback(
    (id: StageId, stage: Partial<Server.Stage>) => {
      if (socket) {
        const payload: ChangeStagePayload = {
          id,
          update: stage,
        };
        socket.emit(ClientStageEvents.CHANGE_STAGE, payload);
      }
    },
    [socket]
  );

  const joinStage = useCallback(
    (reqStageId: StageId, reqGroupId: GroupId, password: string): Promise<void> => {
      if (socket) {
        const payload: JoinStagePayload = {
          stageId: reqStageId,
          groupId: reqGroupId,
          password: password || undefined,
        };
        return new Promise<void>((resolve, reject) => {
          socket.emit(ClientStageEvents.JOIN_STAGE, payload, (error) => {
            if (!error) resolve();
            else reject(error);
          });
        });
      }
      return null;
    },
    [socket]
  );

  const leaveStage = useCallback(() => {
    if (socket) {
      socket.emit(ClientStageEvents.LEAVE_STAGE);
    }
    setRequest(undefined, undefined, null);
  }, [socket]);

  const leaveStageForGood = useCallback(
    (id: StageId) => {
      if (socket) {
        socket.emit(ClientStageEvents.LEAVE_STAGE_FOR_GOOD, id);
      }
      if (stageId && stageId === id) {
        setRequest(undefined, undefined, null);
      }
    },
    [socket]
  );

  const removeStage = useCallback(
    (id: StageId) => {
      if (socket) {
        socket.emit(ClientStageEvents.REMOVE_STAGE, id);
      }
    },
    [socket]
  );

  const createGroup = useCallback(
    (createStageId: StageId, name: string) => {
      if (socket) {
        const payload: AddGroupPayload = {
          stageId: createStageId,
          name,
        };
        socket.emit(ClientStageEvents.ADD_GROUP, payload);
      }
    },
    [socket]
  );

  const updateGroup = useCallback(
    (id: GroupId, update: Partial<Server.Group>) => {
      if (socket) {
        const payload: ChangeGroupPayload = {
          id,
          update,
        };
        socket.emit(ClientStageEvents.CHANGE_GROUP, payload);
      }
    },
    [socket]
  );

  const removeGroup = useCallback(
    (id: GroupId) => {
      if (socket) {
        socket.emit(ClientStageEvents.REMOVE_GROUP, id);
      }
    },
    [socket]
  );

  const updateStageMember = useCallback(
    (
      id: StageMemberId,
      update: Partial<
        {
          isDirector: boolean;
        } & ThreeDimensionAudioProperties
      >
    ) => {
      if (socket) {
        const payload: ChangeStageMemberPayload = {
          id,
          update,
        };
        socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER, payload);
      }
    },
    [socket]
  );

  const updateStageMemberOv = useCallback(
    (id: StageMemberOvTrackId, update: Partial<ThreeDimensionAudioProperties>) => {
      if (socket) {
        const payload: ChangeStageMemberOvTrackPayload = {
          id,
          update,
        };
        socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER_OV, payload);
      }
    },
    [socket]
  );

  const updateStageMemberAudio = useCallback(
    (id: StageMemberAudioProducerId, update: Partial<ThreeDimensionAudioProperties>) => {
      if (socket) {
        const payload: ChangeStageMemberAudioProducerPayload = {
          id,
          update,
        };
        socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER_AUDIO, payload);
      }
    },
    [socket]
  );

  const setCustomGroup = useCallback(
    (groupId: GroupId, volume: number, muted: boolean) => {
      if (socket) {
        const payload: SetCustomGroupPayload = {
          groupId,
          volume,
          muted,
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_GROUP, payload);
      }
    },
    [socket]
  );

  const removeCustomGroup = useCallback(
    (id: GroupId) => {
      if (socket) {
        const payload: RemoveCustomGroupPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_GROUP, payload);
      }
    },
    [socket]
  );

  const setCustomStageMember = useCallback(
    (stageMemberId: StageMemberId, update: Partial<ThreeDimensionAudioProperties>) => {
      if (socket) {
        const payload: SetCustomStageMemberPayload = {
          stageMemberId,
          update,
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER, payload);
      }
    },
    [socket]
  );

  const removeCustomStageMember = useCallback(
    (id: GroupId) => {
      if (socket) {
        const payload: RemoveCustomStageMemberPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER, payload);
      }
    },
    [socket]
  );

  const setCustomStageMemberAudio = useCallback(
    (
      stageMemberAudioId: StageMemberAudioProducerId,
      update: Partial<ThreeDimensionAudioProperties>
    ) => {
      if (socket) {
        const payload: SetCustomStageMemberAudioPayload = {
          stageMemberAudioId,
          update,
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER_AUDIO, payload);
      }
    },
    [socket]
  );

  const removeCustomStageMemberAudio = useCallback(
    (id: GroupId) => {
      if (socket) {
        const payload: RemoveCustomStageMemberAudioPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER_AUDIO, payload);
      }
    },
    [socket]
  );

  const setCustomStageMemberOv = useCallback(
    (
      stageMemberOvTrackId: StageMemberOvTrackId,
      update: Partial<ThreeDimensionAudioProperties>
    ) => {
      if (socket) {
        const payload: SetCustomStageMemberOvPayload = {
          stageMemberOvTrackId,
          update,
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER_OV, payload);
      }
    },
    [socket]
  );

  const removeCustomStageMemberOv = useCallback(
    (id: GroupId) => {
      if (socket) {
        const payload: RemoveCustomStageMemberOvPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER_OV, payload);
      }
    },
    [socket]
  );

  return {
    // Methods
    updateDevice,
    updateUser,
    createStage,
    joinStage,
    leaveStage,
    updateStage,
    removeStage,
    createGroup,
    updateGroup,
    removeGroup,
    updateStageMember,
    setCustomGroup,
    removeCustomGroup,
    setCustomStageMember,
    removeCustomStageMember,
    setCustomStageMemberAudio,
    removeCustomStageMemberAudio,
    setCustomStageMemberOv,
    removeCustomStageMemberOv,
    updateStageMemberAudio,
    updateStageMemberOv,
    leaveStageForGood,
  };
};

export default useStageActions;
