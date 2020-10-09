import {
    Device,
    DeviceId,
    GroupId,
    StageId,
    StageMemberAudioProducerId,
    StageMemberId,
    StageMemberOvTrackId
} from "./common/model.server";
import * as Server from "./common/model.server";
import {ThreeDimensionAudioProperties} from "./common/model.utils";
import {useCallback} from "react";
import {
    AddGroupPayload,
    AddStagePayload,
    ChangeGroupPayload,
    ChangeStageMemberAudioProducerPayload,
    ChangeStageMemberOvTrackPayload,
    ChangeStageMemberPayload,
    ChangeStagePayload,
    JoinStagePayload,
    SetCustomGroupPayload, SetCustomStageMemberAudioProducerPayload, SetCustomStageMemberOvTrackPayload,
    SetCustomStageMemberPayload
} from "./common/payloads";
import {ClientDeviceEvents, ClientStageEvents, ClientUserEvents} from "./common/events";
import {useRequest} from "../useRequest";
import useStageSelector from "./useStageSelector";
import {useStageContext} from "./useStageContext";

export interface StageActionsProps {
    updateDevice(id: DeviceId, device: Partial<Device>);

    updateUser(name: string, avatarUrl?: string);

    // Methods
    createStage(name: string, password: string | null, width?: number, length?: number, height?: number, reflection?: number, absorption?: number);

    updateStage(id: StageId, stage: Partial<Server.Stage>);

    joinStage(stageId: StageId, groupId: GroupId, password: string | null): Promise<void>;

    leaveStage();

    leaveStageForGood(id: StageId);

    removeStage(id: StageId);

    createGroup(stageId: StageId, name: string);

    updateGroup(id: GroupId, group: Partial<Server.Group>);

    removeGroup(id: GroupId);

    updateStageMember(id: StageMemberId, update: Partial<{
        isDirector: boolean;
    } & ThreeDimensionAudioProperties>);

    setCustomGroup(groupId: GroupId, volume: number);

    setCustomStageMember(id: StageMemberId, update: Partial<ThreeDimensionAudioProperties>);

    updateStageMemberAudio(id: StageMemberAudioProducerId, update: Partial<ThreeDimensionAudioProperties>);

    setCustomStageMemberAudio(stageMemberAudioProducerId: StageMemberAudioProducerId, update: Partial<ThreeDimensionAudioProperties>);

    updateStageMemberTrack(id: StageMemberOvTrackId, update: Partial<ThreeDimensionAudioProperties>);

    setCustomStageMemberTrack(stageMemberOvTrackId: StageMemberOvTrackId, update: Partial<ThreeDimensionAudioProperties>);
}

const useStageActions = (): StageActionsProps => {
    const {socket} = useStageContext();
    const {current} = useStageSelector(state => ({
        current: state.current
    }));
    const {setRequest} = useRequest();

    const updateDevice = useCallback((deviceId: string, device: Partial<Omit<Device, "_id">>) => {
        if (socket) {
            socket.emit(ClientDeviceEvents.UPDATE_DEVICE, {
                ...device,
                _id: deviceId
            });
        } else {
            throw new Error("Socket connection wasn't ready");
        }
    }, [socket]);

    const updateUser = useCallback((name: string, avatarUrl?: string) => {
        if (socket) {
            socket.emit(ClientUserEvents.CHANGE_USER, {
                name: name,
                avatarUrl: avatarUrl
            });
        } else {
            throw new Error("Socket connection wasn't ready");
        }
    }, [socket]);

    const createStage = useCallback((name: string, password: string, width?: number, length?: number, height?: number, reflection?: number, absorption?: number) => {
        if (socket) {
            const payload: AddStagePayload = {
                name: name,
                password: password,
                width: width || 25,
                length: length || 13,
                height: height || 7.5,
                damping: reflection || 0.7,
                absorption: absorption || 0.6
            }
            socket.emit(ClientStageEvents.ADD_STAGE, payload);
        }
    }, [socket]);

    const updateStage = useCallback((id: StageId, stage: Partial<Server.Stage>) => {
        if (socket) {
            const payload: ChangeStagePayload = {
                id: id,
                update: stage
            }
            socket.emit(ClientStageEvents.CHANGE_STAGE, payload);
        }
    }, [socket]);

    const joinStage = useCallback((stageId: StageId, groupId: GroupId, password: string): Promise<void> => {
        if (socket) {
            const payload: JoinStagePayload = {
                stageId: stageId,
                groupId: groupId,
                password: password || undefined
            }
            return new Promise<void>((resolve, reject) => {
                socket.emit(ClientStageEvents.JOIN_STAGE, payload, (error) => {
                    if (!error)
                        resolve();
                    else
                        reject(error);
                });
            })
        }
    }, [socket]);

    const leaveStage = useCallback(() => {
        if (socket) {
            socket.emit(ClientStageEvents.LEAVE_STAGE);
        }
        setRequest(undefined, undefined, null);
    }, [socket]);

    const leaveStageForGood = useCallback((id: StageId) => {
        if (socket) {
            socket.emit(ClientStageEvents.LEAVE_STAGE_FOR_GOOD, id);
        }
        if (current.stageId && current.stageId === id) {
            setRequest(undefined, undefined, null);
        }
    }, [socket]);

    const removeStage = useCallback((id: StageId) => {
        if (socket) {
            socket.emit(ClientStageEvents.REMOVE_STAGE, id);
        }
    }, [socket]);

    const createGroup = useCallback((stageId: StageId, name: string) => {
        if (socket) {
            const payload: AddGroupPayload = {
                stageId: stageId,
                name: name
            }
            socket.emit(ClientStageEvents.ADD_GROUP, payload);
        }
    }, [socket]);

    const updateGroup = useCallback((id: GroupId, update: Partial<Server.Group>) => {
        if (socket) {
            const payload: ChangeGroupPayload = {
                id: id,
                update: update
            }
            socket.emit(ClientStageEvents.CHANGE_GROUP, payload);
        }
    }, [socket]);

    const removeGroup = useCallback((id: GroupId) => {
        if (socket) {
            socket.emit(ClientStageEvents.REMOVE_GROUP, id);
        }
    }, [socket]);

    const updateStageMember = useCallback((id: StageMemberId, update: Partial<{
        isDirector: boolean;
    } & ThreeDimensionAudioProperties>) => {
        if (socket) {
            const payload: ChangeStageMemberPayload = {
                id: id,
                update: update
            }
            socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER, payload);
        }
    }, [socket]);

    const setCustomGroup = useCallback((groupId: GroupId, volume: number) => {
        if (socket) {
            const payload: SetCustomGroupPayload = {
                groupId: groupId,
                volume: volume
            }
            socket.emit(ClientStageEvents.SET_CUSTOM_GROUP, payload);
        }
    }, [socket]);

    const setCustomStageMember = useCallback((stageMemberId: StageMemberId, update: Partial<ThreeDimensionAudioProperties>) => {
        if (socket) {
            const payload: SetCustomStageMemberPayload = {
                stageMemberId: stageMemberId,
                update: update
            }
            socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER, payload);
        }
    }, [socket]);

    const updateStageMemberAudio = useCallback((id: StageMemberAudioProducerId, update: Partial<ThreeDimensionAudioProperties>) => {
        if (socket) {
            const payload: ChangeStageMemberAudioProducerPayload = {
                id: id,
                update: update
            }
            socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER_AUDIO, payload);
        }
    }, [socket]);

    const updateStageMemberTrack = useCallback((id: StageMemberOvTrackId, update: Partial<ThreeDimensionAudioProperties>) => {
        if (socket) {
            const payload: ChangeStageMemberOvTrackPayload = {
                id: id,
                update: update
            }
            socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER_OV, payload);
        }
    }, [socket]);

    const setCustomStageMemberAudio = useCallback((stageMemberAudioId: StageMemberAudioProducerId, update: Partial<ThreeDimensionAudioProperties>) => {
        if (socket) {
            const payload: SetCustomStageMemberAudioProducerPayload = {
                stageMemberAudioId: stageMemberAudioId,
                update: update
            }
            socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER_AUDIO, payload);
        }
    }, [socket]);


    const setCustomStageMemberTrack = useCallback((stageMemberOvTrackId: StageMemberOvTrackId, update: Partial<ThreeDimensionAudioProperties>) => {
        if (socket) {
            const payload: SetCustomStageMemberOvTrackPayload = {
                stageMemberOvTrackId: stageMemberOvTrackId,
                update: update
            }
            socket.emit(ClientStageEvents.SET_CUSTOM_STAGE_MEMBER_OV, payload);
        }
    }, [socket]);

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
        setCustomGroup: setCustomGroup,
        setCustomStageMember: setCustomStageMember,
        updateStageMemberAudio: updateStageMemberAudio,
        setCustomStageMemberAudio: setCustomStageMemberAudio,
        updateStageMemberTrack: updateStageMemberTrack,
        setCustomStageMemberTrack: setCustomStageMemberTrack,
        leaveStageForGood: leaveStageForGood
    }
}

export default useStageActions;