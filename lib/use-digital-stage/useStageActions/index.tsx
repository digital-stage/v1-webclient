import debug from 'debug';
import React, { useCallback } from 'react';
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

const d = debug('useStageActions');

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

const throwAddProviderError = () => {
  throw new Error('Please wrap the DOM tree with the StageActionProvider');
};

const StageActionContext = React.createContext<TStageActionContext>({
  createGroup: throwAddProviderError,
  createStage: throwAddProviderError,
  joinStage: throwAddProviderError,
  leaveStage: throwAddProviderError,
  leaveStageForGood: throwAddProviderError,
  removeCustomGroup: throwAddProviderError,
  removeCustomStageMember: throwAddProviderError,
  removeCustomStageMemberAudio: throwAddProviderError,
  removeCustomStageMemberOv: throwAddProviderError,
  removeGroup: throwAddProviderError,
  removeStage: throwAddProviderError,
  setCustomGroup: throwAddProviderError,
  setCustomStageMember: throwAddProviderError,
  setCustomStageMemberAudio: throwAddProviderError,
  setCustomStageMemberOv: throwAddProviderError,
  updateDevice: throwAddProviderError,
  updateGroup: throwAddProviderError,
  updateStage: throwAddProviderError,
  updateStageMember: throwAddProviderError,
  updateStageMemberAudio: throwAddProviderError,
  updateStageMemberOv: throwAddProviderError,
  updateUser: throwAddProviderError,
});

const StageActionsProvider = (props: {
  children: React.ReactNode;
  handleError: (error: Error) => void;
}): JSX.Element => {
  const { children, handleError } = props;
  const socketAPI = useSocket();
  const { socket } = socketAPI;
  const { requestLeave } = useStageHandling();
  const stageId = useCurrentStageId();

  const updateDevice = useCallback(
    (deviceId: string, device: Partial<Omit<Device, '_id'>>) => {
      if (socket) {
        socket.emit(ClientDeviceEvents.UPDATE_DEVICE, {
          ...device,
          _id: deviceId,
        });
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const updateUser = useCallback(
    (name: string, avatarUrl?: string) => {
      if (socket) {
        socket.emit(ClientUserEvents.CHANGE_USER, {
          name,
          avatarUrl,
        });
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
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
        d(`createStage(${name}, ...)`);
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
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const updateStage = useCallback(
    (id: string, stage: Partial<Stage>) => {
      if (socket) {
        d(`updateStage(${id}, ...)`);
        const payload: ChangeStagePayload = {
          id,
          update: stage,
        };
        socket.emit(ClientStageEvents.CHANGE_STAGE, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const joinStage = useCallback(
    (reqStageId: string, reqGroupId: string, password: string): Promise<void> => {
      if (socket) {
        d(`joinStage(${reqStageId}, ${reqGroupId}, ...)`);
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
      handleError(new Error('Not connected'));
      return Promise.reject(new Error('Not connected'));
    },
    [socket, handleError]
  );

  const leaveStage = useCallback(() => {
    if (socket) {
      d(`leaveStage()`);
      socket.emit(ClientStageEvents.LEAVE_STAGE);
    } else {
      handleError(new Error("Socket connection wasn't ready"));
      throw new Error("Socket connection wasn't ready");
    }

    // Also update request handler
    requestLeave();
  }, [socket, requestLeave, handleError]);

  const leaveStageForGood = useCallback(
    (id: string) => {
      if (socket) {
        d(`leaveStageForGood(${id}, ...)`);
        socket.emit(ClientStageEvents.LEAVE_STAGE_FOR_GOOD, id);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
      if (stageId && stageId === id) {
        // Also update request handler
        requestLeave();
      }
    },
    [socket, requestLeave, stageId, handleError]
  );

  const removeStage = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeStage(${id}, ...)`);
        socket.emit(ClientStageEvents.REMOVE_STAGE, id);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const createGroup = useCallback(
    (createStageId: string, name: string) => {
      if (socket) {
        d(`createGroup(${createStageId}, ...)`);
        const payload: AddGroupPayload = {
          stageId: createStageId,
          name,
        };
        socket.emit(ClientStageEvents.ADD_GROUP, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const updateGroup = useCallback(
    (id: string, update: Partial<Group>) => {
      if (socket) {
        d(`updateGroup(${id}, ...)`);
        const payload: ChangeGroupPayload = {
          id,
          update,
        };
        socket.emit(ClientStageEvents.CHANGE_GROUP, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const removeGroup = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeGroup(${id}, ...)`);
        socket.emit(ClientStageEvents.REMOVE_GROUP, id);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
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
      d(`updateStageMember(${id}, ...)`);
      if (socket) {
        const payload: ChangeStageMemberPayload = {
          id,
          update,
        };
        socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const updateStageMemberOv = useCallback(
    (id: string, update: Partial<ThreeDimensionAudioProperties>) => {
      if (socket) {
        d(`updateStageMemberOv(${id}, ...)`);
        const payload: ChangeStageMemberOvTrackPayload = {
          id,
          update,
        };
        socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER_OV, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const updateStageMemberAudio = useCallback(
    (id: string, update: Partial<ThreeDimensionAudioProperties>) => {
      if (socket) {
        d(`updateStageMemberAudio(${id}, ...)`);
        const payload: ChangeStageMemberAudioProducerPayload = {
          id,
          update,
        };
        socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER_AUDIO, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const setCustomGroup = useCallback(
    (groupId: string, volume: number, muted: boolean) => {
      if (socket) {
        d(`setCustomGroup(${groupId}, ...)`);
        const payload: SetCustomGroupPayload = {
          groupId,
          volume,
          muted,
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_GROUP, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const removeCustomGroup = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeCustomGroup(${id}, ...)`);
        const payload: RemoveCustomGroupPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_GROUP, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const setCustomStageMember = useCallback(
    (stageMemberId: string, update: Partial<ThreeDimensionAudioProperties>) => {
      if (socket) {
        d(`setCustomStageMember(${stageMemberId}, ...)`);
        const payload: SetCustomStageMemberPayload = {
          stageMemberId,
          update,
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const removeCustomStageMember = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeCustomStageMember(${id}, ...)`);
        const payload: RemoveCustomStageMemberPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const setCustomStageMemberAudio = useCallback(
    (stageMemberAudioId: string, update: Partial<ThreeDimensionAudioProperties>) => {
      if (socket) {
        d(`setCustomStageMemberAudio(${stageMemberAudioId}, ...)`);
        const payload: SetCustomStageMemberAudioPayload = {
          stageMemberAudioId,
          update,
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER_AUDIO, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const removeCustomStageMemberAudio = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeCustomStageMemberAudio(${id}, ...)`);
        const payload: RemoveCustomStageMemberAudioPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER_AUDIO, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const setCustomStageMemberOv = useCallback(
    (stageMemberOvTrackId: string, update: Partial<ThreeDimensionAudioProperties>) => {
      if (socket) {
        d(`setCustomStageMemberOv(${stageMemberOvTrackId}, ...)`);
        const payload: SetCustomStageMemberOvPayload = {
          stageMemberOvTrackId,
          update,
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER_OV, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const removeCustomStageMemberOv = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeCustomStageMemberOv(${id}, ...)`);
        const payload: RemoveCustomStageMemberOvPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER_OV, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  return (
    <StageActionContext.Provider
      value={{
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
      }}
    >
      {children}
    </StageActionContext.Provider>
  );
};

export { StageActionsProvider };

const useStageActions = (): TStageActionContext =>
  React.useContext<TStageActionContext>(StageActionContext);

export default useStageActions;
