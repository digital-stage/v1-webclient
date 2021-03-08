import debug from 'debug';
import React, { useCallback } from 'react';
import { Device, Stage, Group, ThreeDimensionAudioProperties } from '../types';
import useSocket from '../useSocket';
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
    RemoveCustomGroupVolumePayload,
    RemoveCustomRemoteAudioVolumePayload, RemoveCustomRemoteOvVolumePayload,
    RemoveCustomStageMemberPositionPayload,
    RemoveCustomStageMemberVolumePayload,
    SendChatMessagePayload,
    SetCustomGroupVolumePayload,
    SetCustomRemoteAudioVolumePayload,
    SetCustomRemoteOvVolumePayload,
    SetCustomStageMemberPositionPayload,
    SetCustomStageMemberVolumePayload,
} from '../global/SocketPayloads';
import ThreeDimensionProperties from "../types/ThreeDimensionProperties";

const d = debug('useStageActions');

export interface TStageActionContext {
  updateDevice: (id: string, device: Partial<Device>) => void;

  updateUser: (name: string, avatarUrl?: string) => void;

  // Always callable
  createStage: (
    name: string,
    password: string | null,
    width?: number,
    length?: number,
    height?: number,
    reflection?: number,
    absorption?: number
  ) => void;

  joinStage: (stageId: string, groupId: string, password?: string) => Promise<void>;

  leaveStage: () => void;

  leaveStageForGood: (id: string) => void;

  // Customized group
  setCustomGroupVolume: (groupId: string, update: {volume?: number; muted?: boolean}) => void;

  removeCustomGroupVolume: (customGroupId: string) => void;

  setCustomStageMemberPosition: (
    stageMemberId: string,
    update: Partial<ThreeDimensionProperties>
  ) => void;

  removeCustomStageMemberPosition: (customStageMemberId: string) => void;

    setCustomStageMemberVolume: (
        stageMemberId: string,
        update: {volume?: number; muted?: boolean}
    ) => void;

    removeCustomStageMemberVolume: (customStageMemberId: string) => void;

  setCustomStageMemberAudioVolume: (
    stageMemberAudioId: string,
    update: {volume?: number; muted?: boolean}
  ) => void;

  removeCustomStageMemberAudioVolume: (customStageMemberAudioId: string) => void;

  setCustomStageMemberOvVolume: (
    stageMemberOvId: string,
    update: {volume?: number; muted?: boolean}
  ) => void;

  removeCustomStageMemberOvVolume: (customStageMemberOvId: string) => void;

  // Admin only
  updateStage: (id: string, stage: Partial<Stage>) => void;

  removeStage: (id: string) => void;

  createGroup: (stageId: string, name: string) => void;

  updateGroup: (id: string, group: Partial<Group>) => void;

  removeGroup: (id: string) => void;

  updateStageMember: (
    id: string,
    update: Partial<
      {
        isDirector: boolean;
      } & ThreeDimensionAudioProperties
    >
  ) => void;

  updateStageMemberAudio: (id: string, update: Partial<ThreeDimensionAudioProperties>) => void;

  updateStageMemberOv: (id: string, update: Partial<ThreeDimensionAudioProperties>) => void;

  sendChatMessage: (message: string) => void;
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
  removeCustomGroupVolume: throwAddProviderError,
  removeCustomStageMemberVolume: throwAddProviderError,
    removeCustomStageMemberPosition: throwAddProviderError,
  removeCustomStageMemberAudioVolume: throwAddProviderError,
  removeCustomStageMemberOvVolume: throwAddProviderError,
  removeGroup: throwAddProviderError,
  removeStage: throwAddProviderError,
  setCustomGroupVolume: throwAddProviderError,
    setCustomStageMemberPosition: throwAddProviderError,
  setCustomStageMemberVolume: throwAddProviderError,
  setCustomStageMemberAudioVolume: throwAddProviderError,
  setCustomStageMemberOvVolume: throwAddProviderError,
  updateDevice: throwAddProviderError,
  updateGroup: throwAddProviderError,
  updateStage: throwAddProviderError,
  updateStageMember: throwAddProviderError,
  updateStageMemberAudio: throwAddProviderError,
  updateStageMemberOv: throwAddProviderError,
  updateUser: throwAddProviderError,
  sendChatMessage: throwAddProviderError,
});

const StageActionsProvider = (props: {
  children: React.ReactNode;
  handleError: (error: Error) => void;
}): JSX.Element => {
  const { children, handleError } = props;
  const { socket } = useSocket();

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
      password: string | null,
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
          password: password || undefined,
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
    (reqStageId: string, reqGroupId: string, password?: string): Promise<void> => {
      if (socket) {
        d(`joinStage(${reqStageId}, ${reqGroupId}, ...)`);
        const payload: JoinStagePayload = {
          stageId: reqStageId,
          groupId: reqGroupId,
          password,
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
  }, [socket, handleError]);

  const leaveStageForGood = useCallback(
    (id: string) => {
      if (socket) {
        d(`leaveStageForGood(${id}, ...)`);
        socket.emit(ClientStageEvents.LEAVE_STAGE_FOR_GOOD, id);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
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
      d(update);
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

  const setCustomGroupVolume = useCallback(
    (groupId: string, update: {volume?: number; muted?: boolean}) => {
      if (socket) {
        d(`setCustomGroupVolume(${groupId}, ...)`);
        const payload: SetCustomGroupVolumePayload = {
          groupId,
          update
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_GROUP_VOLUME, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const removeCustomGroupVolume = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeCustomGroupVolume(${id}, ...)`);
        const payload: RemoveCustomGroupVolumePayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_GROUP_VOLUME, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const setCustomStageMemberPosition = useCallback(
    (stageMemberId: string, update: Partial<ThreeDimensionProperties>) => {
      if (socket) {
        d(`setCustomStageMemberPosition(${stageMemberId}, ...)`);
        const payload: SetCustomStageMemberPositionPayload = {
          stageMemberId,
            update
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER_POSITION, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const removeCustomStageMemberPosition = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeCustomStageMemberPosition(${id}, ...)`);
        const payload: RemoveCustomStageMemberPositionPayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER_POSITION, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );
    const setCustomStageMemberVolume = useCallback(
        (stageMemberId: string, update: {volume?: number; muted?: boolean}) => {
            if (socket) {
                d(`setCustomStageMemberVolume(${stageMemberId}, ...)`);
                const payload: SetCustomStageMemberVolumePayload = {
                    stageMemberId,
                    update
                };
                socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER_VOLUME, payload);
            } else {
                handleError(new Error("Socket connection wasn't ready"));
                throw new Error("Socket connection wasn't ready");
            }
        },
        [socket, handleError]
    );

    const removeCustomStageMemberVolume = useCallback(
        (id: string) => {
            if (socket) {
                d(`removeCustomStageMemberVolume(${id}, ...)`);
                const payload: RemoveCustomStageMemberVolumePayload = id;
                socket.emit(ClientStageEvents.REMOVE_CUSTOM_STAGE_MEMBER_VOLUME, payload);
            } else {
                handleError(new Error("Socket connection wasn't ready"));
                throw new Error("Socket connection wasn't ready");
            }
        },
        [socket, handleError]
    );

  const setCustomStageMemberAudioVolume = useCallback(
    (remoteAudioProducerId: string, update: {volume?: number, muted?: boolean}) => {
      if (socket) {
        d(`setCustomStageMemberAudioVolume(${remoteAudioProducerId}, ...)`);
        const payload: SetCustomRemoteAudioVolumePayload = {
          remoteAudioProducerId,
            update
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_REMOTE_AUDIO_VOLUME, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const removeCustomStageMemberAudioVolume = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeCustomStageMemberAudioVolume(${id}, ...)`);
        const payload: RemoveCustomRemoteAudioVolumePayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_REMOTE_AUDIO_VOLUME, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const setCustomStageMemberOvVolume = useCallback(
    (remoteOvTrackId: string, update: {volume?: number; position?: boolean;}) => {
      if (socket) {
        d(`setCustomStageMemberOvVolume(${remoteOvTrackId}, ...)`);
        const payload: SetCustomRemoteOvVolumePayload = {
          remoteOvTrackId,
            update
        };
        socket.emit(ClientStageEvents.SET_CUSTOM_REMOTE_OV_VOLUME, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const removeCustomStageMemberOvVolume = useCallback(
    (id: string) => {
      if (socket) {
        d(`removeCustomStageMemberOvVolume(${id}, ...)`);
        const payload: RemoveCustomRemoteOvVolumePayload = id;
        socket.emit(ClientStageEvents.REMOVE_CUSTOM_REMOTE_OV_VOLUME, payload);
      } else {
        handleError(new Error("Socket connection wasn't ready"));
        throw new Error("Socket connection wasn't ready");
      }
    },
    [socket, handleError]
  );

  const sendChatMessage = useCallback(
    (message: string) => {
      if (socket) {
        d(`sendChatMessage(${message}, ...)`);
        const payload: SendChatMessagePayload = message;
        socket.emit(ClientStageEvents.SEND_MESSAGE, payload);
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
        setCustomGroupVolume,
        removeCustomGroupVolume,
        setCustomStageMemberVolume,
        removeCustomStageMemberVolume,
          setCustomStageMemberPosition,
          removeCustomStageMemberPosition,
        setCustomStageMemberAudioVolume,
        removeCustomStageMemberAudioVolume,
        setCustomStageMemberOvVolume,
        removeCustomStageMemberOvVolume,
        updateStageMemberAudio,
        updateStageMemberOv,
        leaveStageForGood,
        sendChatMessage,
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
