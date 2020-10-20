import {
    CustomGroupId, CustomStageMemberAudioProducerId, CustomStageMemberId,
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
    AddCustomGroupPayload,
    AddGroupPayload,
    AddStagePayload,
    ChangeGroupPayload,
    ChangeStageMemberAudioProducerPayload,
    ChangeStageMemberOvTrackPayload,
    ChangeStageMemberPayload,
    ChangeStagePayload,
    JoinStagePayload, RemoveCustomGroupPayload,
    SetCustomGroupPayload, SetCustomStageMemberAudioProducerPayload, SetCustomStageMemberOvTrackPayload,
    SetCustomStageMemberPayload, UpdateCustomGroupPayload
} from "./common/payloads";
import {ClientDeviceEvents, ClientStageEvents, ClientUserEvents} from "./common/events";
import {useRequest} from "../useRequest";
import {useSocket} from "./useStageContext";
import {NormalizedState} from "./useStageContext/schema";
import {useSelector} from "./useStageContext/redux";

export interface StageActionsProps {
    updateDevice(id: DeviceId, device: Partial<Device>);

    updateUser(name: string, avatarUrl?: string);

    // Always callable
    createStage(name: string, password: string | null, width?: number, length?: number, height?: number, reflection?: number, absorption?: number);

    joinStage(stageId: StageId, groupId: GroupId, password: string | null): Promise<void>;

    leaveStage();

    leaveStageForGood(id: StageId);

    // Customized group
    addCustomGroup(groupId: GroupId, volume: number);

    updateCustomGroup(customGroupId: CustomGroupId, volume: number);

    //setCustomGroupVolume(groupId: GroupId, volume: number);

    removeCustomGroup(customGroupId: GroupId);

    //removeCustomGroupVolume(customGroupId: CustomGroupId);

    /*
    // Customized stage member
    addCustomStageMember(stageMemberId: StageMemberId, initial: Partial<ThreeDimensionAudioProperties>);
    */
    updateCustomStageMember(customStageMemberId: CustomStageMemberId, update: Partial<ThreeDimensionAudioProperties>);
/*
    removeCustomStageMember(customStageMemberId: CustomStageMemberId);


    // Customized stage member audio
    addCustomStageMemberAudio(stageMemberId: StageMemberId, initial: Partial<ThreeDimensionAudioProperties>);

    updateCustomStageMemberAudio(stageMemberAudioProducerId: StageMemberAudioProducerId, update: Partial<ThreeDimensionAudioProperties>);

    removeCustomStageMemberAudio(stageMemberAudioProducerId: StageMemberAudioProducerId);


    // Customized stage member ov track
    addCustomStageMemberOvTrack(stageMemberOvTrackId: StageMemberOvTrackId, initial: Partial<ThreeDimensionAudioProperties>);

    updateCustomStageMemberOvTrack(stageMemberAudioProducerId: CustomStageMemberAudioProducerId, update: Partial<ThreeDimensionAudioProperties>);

    removeCustomStageMemberOvTrack(stageMemberAudioProducerId: CustomStageMemberAudioProducerId);
    */

    // Admin only
    updateStage(id: StageId, stage: Partial<Server.Stage>);

    removeStage(id: StageId);

    createGroup(stageId: StageId, name: string);

    updateGroup(id: GroupId, group: Partial<Server.Group>);

    removeGroup(id: GroupId);

    updateStageMember(id: StageMemberId, update: Partial<{
        isDirector: boolean;
    } & ThreeDimensionAudioProperties>);

    //updateStageMemberAudio(id: StageMemberAudioProducerId, update: Partial<ThreeDimensionAudioProperties>);

    //updateStageMemberOvTrack(id: StageMemberOvTrackId, update: Partial<ThreeDimensionAudioProperties>);
}

const useStageActions = (): StageActionsProps => {
    const socket = useSocket();
    const stageId = useSelector<NormalizedState, string | undefined>(state => state.stageId);
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
        if (stageId && stageId === id) {
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

    const addCustomGroup = useCallback((groupId: GroupId, volume: number) => {
        if (socket) {
            const payload: AddCustomGroupPayload = {
                groupId: groupId,
                volume: volume
            }
            socket.emit(ClientStageEvents.ADD_CUSTOM_GROUP, payload);
        }
    }, [socket]);

    const updateCustomGroup = useCallback((customGroupId: GroupId, volume: number) => {
        if (socket) {
            const payload: UpdateCustomGroupPayload = {
                customGroupId: customGroupId,
                volume: volume
            }
            socket.emit(ClientStageEvents.UPDATE_CUSTOM_GROUP, payload);
        }
    }, [socket]);

    const removeCustomGroup = useCallback((customGroupId: GroupId) => {
        if (socket) {
            const payload: RemoveCustomGroupPayload = {
                customGroupId: customGroupId
            }
            socket.emit(ClientStageEvents.REMOVE_CUSTOM_GROUP, payload);
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
        addCustomGroup: addCustomGroup,
        updateCustomGroup: updateCustomGroup,
        removeCustomGroup: removeCustomGroup,
        updateCustomStageMember: setCustomStageMember,
        //setCustomStageMember: setCustomStageMember,
        //updateStageMemberAudio: updateStageMemberAudio,
        //setCustomStageMemberAudio: setCustomStageMemberAudio,
        //updateStageMemberTrack: updateStageMemberTrack,
        //setCustomStageMemberTrack: setCustomStageMemberTrack,
        leaveStageForGood: leaveStageForGood
    }
}

export default useStageActions;