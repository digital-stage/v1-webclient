import { useCallback } from 'react';
import { ITeckosClient, TeckosClient } from 'teckos-client';
import {
  ServerDeviceEvents,
  ServerGlobalEvents,
  ServerStageEvents,
  ServerUserEvents,
} from '../global/SocketEvents';
import {
  Device,
  Stage,
  User,
  Group,
  CustomGroup,
  StageMember,
  CustomStageMember,
  RemoteVideoProducer,
  RemoteAudioProducer,
  StageMemberOvTrack,
  CustomRemoteAudioProducer,
  CustomRemoteOvTrack,
  SoundCard,
  TrackPreset,
  Track,
} from '../types';
import useDispatch from './useDispatch';
import allActions from './actions';
import { InitialStagePackage } from './actions/stageActions';

export interface TSocketToDispatch {
  registerHandler(socket: ITeckosClient): void;
}

const useSocketToDispatch = (): TSocketToDispatch => {
  const dispatch = useDispatch();
  const registerHandler = useCallback(
    (socket: TeckosClient): void => {
      socket.on('disconnect', () => {
        // Cleanup
        dispatch(allActions.client.reset());
      });

      socket.on(ServerGlobalEvents.READY, () => {
        dispatch(allActions.server.setReady());
      });

      socket.on(ServerDeviceEvents.LOCAL_DEVICE_READY, (payload: Device) => {
        dispatch(allActions.deviceActions.server.handleLocalDeviceReady(payload));
      });

      socket.on(ServerUserEvents.USER_READY, (payload: User) => {
        dispatch(allActions.server.handleUserReady(payload));
      });

      socket.on(ServerUserEvents.USER_CHANGED, (payload: User) => {
        dispatch(allActions.server.changeUser(payload));
      });

      socket.on(ServerDeviceEvents.DEVICE_ADDED, (payload: Device) => {
        dispatch(allActions.deviceActions.server.addDevice(payload));
      });
      socket.on(ServerDeviceEvents.DEVICE_CHANGED, (payload: Device) => {
        dispatch(allActions.deviceActions.server.changeDevice(payload));
      });
      socket.on(ServerDeviceEvents.DEVICE_REMOVED, (payload: string) => {
        dispatch(allActions.deviceActions.server.removeDevice(payload));
      });

      socket.on(ServerStageEvents.REMOTE_USER_ADDED, (payload: User) => {
        dispatch(allActions.stageActions.server.addRemoteUser(payload));
      });

      socket.on(ServerStageEvents.REMOTE_USER_CHANGED, (payload: User) => {
        dispatch(allActions.stageActions.server.changeRemoteUser(payload));
      });

      socket.on(ServerStageEvents.REMOTE_USER_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeRemoteUser(payload));
      });

      socket.on(ServerStageEvents.STAGE_ADDED, (payload: Stage) => {
        dispatch(allActions.stageActions.server.addStage(payload));
      });
      socket.on(ServerGlobalEvents.STAGE_JOINED, (payload: InitialStagePackage) => {
        dispatch(allActions.server.handleStageJoined(payload));
      });
      socket.on(ServerGlobalEvents.STAGE_LEFT, () => {
        dispatch(allActions.server.handleStageLeft());
      });
      socket.on(ServerStageEvents.STAGE_CHANGED, (payload: Stage) => {
        dispatch(allActions.stageActions.server.changeStage(payload));
      });
      socket.on(ServerStageEvents.STAGE_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeStage(payload));
      });

      socket.on(ServerStageEvents.GROUP_ADDED, (payload: Group) => {
        dispatch(allActions.stageActions.server.addGroup(payload));
      });
      socket.on(ServerStageEvents.GROUP_CHANGED, (payload: Group) => {
        dispatch(allActions.stageActions.server.changeGroup(payload));
      });
      socket.on(ServerStageEvents.GROUP_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeGroup(payload));
      });

      socket.on(ServerStageEvents.CUSTOM_GROUP_ADDED, (payload: CustomGroup) => {
        dispatch(allActions.stageActions.server.addCustomGroup(payload));
      });
      socket.on(ServerStageEvents.CUSTOM_GROUP_CHANGED, (payload: CustomGroup) => {
        dispatch(allActions.stageActions.server.changeCustomGroup(payload));
      });
      socket.on(ServerStageEvents.CUSTOM_GROUP_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeCustomGroup(payload));
      });

      socket.on(ServerStageEvents.STAGE_MEMBER_ADDED, (payload: StageMember) => {
        dispatch(allActions.stageActions.server.addStageMember(payload));
      });
      socket.on(ServerStageEvents.STAGE_MEMBER_CHANGED, (payload: StageMember) => {
        dispatch(allActions.stageActions.server.changeStageMember(payload));
      });
      socket.on(ServerStageEvents.STAGE_MEMBER_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeStageMember(payload));
      });

      socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED, (payload: CustomStageMember) => {
        dispatch(allActions.stageActions.server.addCustomStageMember(payload));
      });
      socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED, (payload: CustomStageMember) => {
        dispatch(allActions.stageActions.server.changeCustomStageMember(payload));
      });
      socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeCustomStageMember(payload));
      });

      socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED, (payload: RemoteVideoProducer) => {
        dispatch(allActions.stageActions.server.addVideoProducer(payload));
      });
      socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED, (payload: RemoteVideoProducer) => {
        dispatch(allActions.stageActions.server.changeVideoProducer(payload));
      });
      socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeVideoProducer(payload));
      });

      socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED, (payload: RemoteAudioProducer) => {
        dispatch(allActions.stageActions.server.addAudioProducer(payload));
      });
      socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED, (payload: RemoteAudioProducer) => {
        dispatch(allActions.stageActions.server.changeAudioProducer(payload));
      });
      socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeAudioProducer(payload));
      });

      socket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED,
        (payload: CustomRemoteAudioProducer) => {
          dispatch(allActions.stageActions.server.addCustomAudioProducer(payload));
        }
      );
      socket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED,
        (payload: CustomRemoteAudioProducer) => {
          dispatch(allActions.stageActions.server.changeCustomAudioProducer(payload));
        }
      );
      socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeCustomAudioProducer(payload));
      });

      socket.on(ServerStageEvents.STAGE_MEMBER_OV_ADDED, (payload: StageMemberOvTrack) => {
        dispatch(allActions.stageActions.server.addOvTrack(payload));
      });
      socket.on(ServerStageEvents.STAGE_MEMBER_OV_CHANGED, (payload: StageMemberOvTrack) => {
        dispatch(allActions.stageActions.server.changeOvTrack(payload));
      });
      socket.on(ServerStageEvents.STAGE_MEMBER_OV_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeOvTrack(payload));
      });

      socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED, (payload: CustomRemoteOvTrack) => {
        dispatch(allActions.stageActions.server.addCustomOvTrack(payload));
      });
      socket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED,
        (payload: CustomRemoteOvTrack) => {
          dispatch(allActions.stageActions.server.changeCustomOvTrack(payload));
        }
      );
      socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED, (payload: string) => {
        dispatch(allActions.stageActions.server.removeCustomOvTrack(payload));
      });

      socket.on(ServerDeviceEvents.SOUND_CARD_ADDED, (payload: SoundCard) =>
        dispatch({
          type: ServerDeviceEvents.SOUND_CARD_ADDED,
          payload,
        })
      );
      socket.on(ServerDeviceEvents.SOUND_CARD_CHANGED, (payload: SoundCard) =>
        dispatch({
          type: ServerDeviceEvents.SOUND_CARD_CHANGED,
          payload,
        })
      );
      socket.on(ServerDeviceEvents.SOUND_CARD_REMOVED, (payload: string) =>
        dispatch({
          type: ServerDeviceEvents.SOUND_CARD_REMOVED,
          payload,
        })
      );

      socket.on(ServerDeviceEvents.TRACK_PRESET_ADDED, (payload: TrackPreset) =>
        dispatch({
          type: ServerDeviceEvents.TRACK_PRESET_ADDED,
          payload,
        })
      );
      socket.on(ServerDeviceEvents.TRACK_PRESET_CHANGED, (payload: TrackPreset) =>
        dispatch({
          type: ServerDeviceEvents.TRACK_PRESET_CHANGED,
          payload,
        })
      );
      socket.on(ServerDeviceEvents.TRACK_PRESET_REMOVED, (payload: string) =>
        dispatch({
          type: ServerDeviceEvents.TRACK_PRESET_REMOVED,
          payload,
        })
      );

      socket.on(ServerDeviceEvents.TRACK_ADDED, (payload: Track) =>
        dispatch({
          type: ServerDeviceEvents.TRACK_ADDED,
          payload,
        })
      );
      socket.on(ServerDeviceEvents.TRACK_CHANGED, (payload: Track) =>
        dispatch({
          type: ServerDeviceEvents.TRACK_CHANGED,
          payload,
        })
      );
      socket.on(ServerDeviceEvents.TRACK_REMOVED, (payload: string) =>
        dispatch({
          type: ServerDeviceEvents.TRACK_REMOVED,
          payload,
        })
      );
    },
    [dispatch]
  );

  return {
    registerHandler,
  };
};
export default useSocketToDispatch;
