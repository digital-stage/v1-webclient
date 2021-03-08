import {useCallback} from 'react';
import {ITeckosClient, TeckosClient} from 'teckos-client';
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
    StageMember,
    RemoteVideoProducer,
    RemoteAudioProducer,
    RemoteOvTrack,
    SoundCard,
    CustomGroupVolume,
    CustomGroupPosition,
    CustomStageMemberVolume,
    CustomStageMemberPosition,
    CustomRemoteAudioProducerVolume,
    CustomRemoteAudioProducerPosition,
    CustomRemoteOvTrackVolume,
    CustomRemoteOvTrackPosition,
} from '../types';
import useDispatch from './useDispatch';
import allActions from './actions';
import {ChatMessage} from '../types/ChatMessages';
import {InitialStagePackage} from "../types/InitialStagePackage";
import {OvTrack} from "../types/OvTrack";

export interface TSocketToDispatch {
    registerHandler(socket: ITeckosClient): void;
}

const useSocketToDispatch = (): TSocketToDispatch => {
    const dispatch = useDispatch();
    const registerHandler = useCallback(
        (socket: TeckosClient): void => {
            socket.setMaxListeners(60);
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

            socket.on(ServerStageEvents.MESSAGE_SENT, (payload: ChatMessage) => {
                dispatch(allActions.stageActions.server.messageSent(payload));
            });

            socket.on(ServerStageEvents.STAGE_ADDED, (payload: Stage) => {
                dispatch(allActions.stageActions.server.addStage(payload));
            });
            socket.on(ServerStageEvents.STAGE_JOINED, (payload: InitialStagePackage) => {
                dispatch(allActions.server.handleStageJoined(payload));
            });
            socket.on(ServerStageEvents.STAGE_LEFT, () => {
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

            socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_ADDED, (payload: CustomGroupVolume) => {
                dispatch(allActions.stageActions.server.addCustomGroupVolume(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_CHANGED, (payload: CustomGroupVolume) => {
                dispatch(allActions.stageActions.server.changeCustomGroupVolume(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_REMOVED, (payload: string) => {
                dispatch(allActions.stageActions.server.removeCustomGroupVolume(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_POSITION_ADDED, (payload: CustomGroupPosition) => {
                dispatch(allActions.stageActions.server.addCustomGroupPosition(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_POSITION_CHANGED, (payload: CustomGroupPosition) => {
                dispatch(allActions.stageActions.server.changeCustomGroupPosition(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_POSITION_REMOVED, (payload: string) => {
                dispatch(allActions.stageActions.server.removeCustomGroupPosition(payload));
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

            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_VOLUME_ADDED, (payload: CustomStageMemberVolume) => {
                dispatch(allActions.stageActions.server.addCustomStageMemberVolume(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_VOLUME_CHANGED, (payload: CustomStageMemberVolume) => {
                dispatch(allActions.stageActions.server.changeCustomStageMemberVolume(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_VOLUME_REMOVED, (payload: string) => {
                dispatch(allActions.stageActions.server.removeCustomStageMemberVolume(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_POSITION_ADDED, (payload: CustomStageMemberPosition) => {
                dispatch(allActions.stageActions.server.addCustomStageMemberPosition(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_POSITION_CHANGED, (payload: CustomStageMemberPosition) => {
                dispatch(allActions.stageActions.server.changeCustomStageMemberPosition(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_POSITION_REMOVED, (payload: string) => {
                dispatch(allActions.stageActions.server.removeCustomStageMemberPosition(payload));
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
                ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_VOLUME_ADDED,
                (payload: CustomRemoteAudioProducerVolume) => {
                    dispatch(allActions.stageActions.server.addCustomAudioProducerVolume(payload));
                }
            );
            socket.on(
                ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_VOLUME_CHANGED,
                (payload: CustomRemoteAudioProducerVolume) => {
                    dispatch(allActions.stageActions.server.changeCustomAudioProducerVolume(payload));
                }
            );
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_VOLUME_REMOVED, (payload: string) => {
                dispatch(allActions.stageActions.server.removeCustomAudioProducerVolume(payload));
            });
            socket.on(
                ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_POSITION_ADDED,
                (payload: CustomRemoteAudioProducerPosition) => {
                    dispatch(allActions.stageActions.server.addCustomAudioProducerPosition(payload));
                }
            );
            socket.on(
                ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_POSITION_CHANGED,
                (payload: CustomRemoteAudioProducerPosition) => {
                    dispatch(allActions.stageActions.server.changeCustomAudioProducerPosition(payload));
                }
            );
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_POSITION_REMOVED, (payload: string) => {
                dispatch(allActions.stageActions.server.removeCustomAudioProducerPosition(payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_OV_ADDED, (payload: RemoteOvTrack) => {
                dispatch(allActions.stageActions.server.addOvTrack(payload));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_OV_CHANGED, (payload: RemoteOvTrack) => {
                dispatch(allActions.stageActions.server.changeOvTrack(payload));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_OV_REMOVED, (payload: string) => {
                dispatch(allActions.stageActions.server.removeOvTrack(payload));
            });

            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_VOLUME_ADDED, (payload: CustomRemoteOvTrackVolume) => {
                dispatch(allActions.stageActions.server.addCustomOvTrackVolume(payload));
            });
            socket.on(
                ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_VOLUME_CHANGED,
                (payload: CustomRemoteOvTrackVolume) => {
                    dispatch(allActions.stageActions.server.changeCustomOvTrackVolume(payload));
                }
            );
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_VOLUME_REMOVED, (payload: string) => {
                dispatch(allActions.stageActions.server.removeCustomOvTrackVolume(payload));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_ADDED, (payload: CustomRemoteOvTrackPosition) => {
                dispatch(allActions.stageActions.server.addCustomOvTrackPosition(payload));
            });
            socket.on(
                ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_CHANGED,
                (payload: CustomRemoteOvTrackPosition) => {
                    dispatch(allActions.stageActions.server.changeCustomOvTrackPosition(payload));
                }
            );
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_POSITION_REMOVED, (payload: string) => {
                dispatch(allActions.stageActions.server.removeCustomOvTrackPosition(payload));
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

            socket.on(ServerDeviceEvents.TRACK_ADDED, (payload: OvTrack) =>
                dispatch({
                    type: ServerDeviceEvents.TRACK_ADDED,
                    payload,
                })
            );
            socket.on(ServerDeviceEvents.TRACK_CHANGED, (payload: OvTrack) =>
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
