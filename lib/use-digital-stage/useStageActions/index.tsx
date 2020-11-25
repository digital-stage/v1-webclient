import { useCallback } from 'react';
import { Device, Stage, Group, ThreeDimensionAudioProperties } from '../types';
import useSocket from '../useSocket';
import useCurrentStageId from '../hooks/useCurrentStageId';
import { ClientDeviceEvents, ClientStageEvents, ClientUserEvents } from '../global/SocketEvents';
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
} from '../global/SocketPayloads';
import useStageHandling from '../useStageHandling';

export interface TStageActionContext {
  updateDevice(id: string, device: Partial<Device>): void;

  updateUser(name: string, avatarUrl?: string): void;

  // Always callable
  createStage(
    name: string,
    password: string | null,
    width?: number,
    length?: number,
    height?: number,
    reflection?: number,
    absorption?: number
  ): void;

  joinStage(stageId: string, groupId: string, password?: string): Promise<void>;

  leaveStage(): void;

  leaveStageForGood(id: string): void;

  // Customized group
  setCustomGroup(groupId: string, volume: number, muted: boolean): void;

  removeCustomGroup(customGroupId: string): void;

  setCustomStageMember(stageMemberId: string, update: Partial<ThreeDimensionAudioProperties>): void;

  removeCustomStageMember(customStageMemberId: string): void;

  setCustomStageMemberAudio(
    stageMemberAudioId: string,
    update: Partial<ThreeDimensionAudioProperties>
  ): void;

  removeCustomStageMemberAudio(customStageMemberAudioId: string): void;

  setCustomStageMemberOv(
    stageMemberOvId: string,
    update: Partial<ThreeDimensionAudioProperties>
  ): void;

  removeCustomStageMemberOv(customStageMemberOvId: string): void;

  // Admin only
  updateStage(id: string, stage: Partial<Stage>): void;

  removeStage(id: string): void;

  createGroup(stageId: string, name: string): void;

  updateGroup(id: string, group: Partial<Group>): void;

  removeGroup(id: string): void;

  updateStageMember(
    id: string,
    update: Partial<
      {
        isDirector: boolean;
      } & ThreeDimensionAudioProperties
    >
  ): void;

  updateStageMemberAudio(id: string, update: Partial<ThreeDimensionAudioProperties>): void;

  updateStageMemberOv(id: string, update: Partial<ThreeDimensionAudioProperties>): void;
}

const useStageActions = (): TStageActionContext => {
  const { socket } = useSocket();
  const stageId = useCurrentStageId();
  const { requestLeave } = useStageHandling();

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
    (id: string, stage: Partial<Stage>) => {
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
    (reqStageId: string, reqGroupId: string, password: string): Promise<void> => {
      if (socket) {
        const payload: JoinStagePayload = {
          stageId: reqStageId,
          groupId: reqGroupId,
          password: password || undefined,
        };
        return new Promise<void>((resolve, reject) => {
          socket.emit(ClientStageEvents.JOIN_STAGE, payload, (joinError: Error) => {
            if (!joinError) resolve();
            else reject(joinError);
          });
        });
      }
      return Promise.reject(new Error('Not connected'));
    },
    [socket]
  );

  const leaveStage = useCallback(() => {
    if (socket) {
      socket.emit(ClientStageEvents.LEAVE_STAGE);
    }

    // Also update request handler
    requestLeave();
  }, [socket, requestLeave]);

  const leaveStageForGood = useCallback(
    (id: string) => {
      if (socket) {
        socket.emit(ClientStageEvents.LEAVE_STAGE_FOR_GOOD, id);
      }
      if (stageId && stageId === id) {
        // Also update request handler
        requestLeave();
      }
    },
    [socket, requestLeave, stageId]
  );

  const removeStage = useCallback(
    (id: string) => {
      if (socket) {
        socket.emit(ClientStageEvents.REMOVE_STAGE, id);
      }
    },
    [socket]
  );

  const createGroup = useCallback(
    (createStageId: string, name: string) => {
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
    (id: string, update: Partial<Group>) => {
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
    (id: string) => {
      if (socket) {
        socket.emit(ClientStageEvents.REMOVE_GROUP, id);
      }
    },
    [socket]
  );

  const updateStageMember = useCallback(
    (
      id: string,
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
    (id: string, update: Partial<ThreeDimensionAudioProperties>) => {
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
    (id: string, update: Partial<ThreeDimensionAudioProperties>) => {
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
    (groupId: string, volume: number, muted: boolean) => {
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
    (id: string) => {
      if (socket) {
        const payload: RemoveCustomGroupPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_GROUP, payload);
      }
    },
    [socket]
  );

  const setCustomStageMember = useCallback(
    (stageMemberId: string, update: Partial<ThreeDimensionAudioProperties>) => {
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
    (id: string) => {
      if (socket) {
        const payload: RemoveCustomStageMemberPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER, payload);
      }
    },
    [socket]
  );

  const setCustomStageMemberAudio = useCallback(
    (stageMemberAudioId: string, update: Partial<ThreeDimensionAudioProperties>) => {
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
    (id: string) => {
      if (socket) {
        const payload: RemoveCustomStageMemberAudioPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER_AUDIO, payload);
      }
    },
    [socket]
  );

  const setCustomStageMemberOv = useCallback(
    (stageMemberOvTrackId: string, update: Partial<ThreeDimensionAudioProperties>) => {
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
    (id: string) => {
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
