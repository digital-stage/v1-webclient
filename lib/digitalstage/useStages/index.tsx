import React, {Reducer, useCallback, useContext, useEffect, useReducer} from "react";
import * as Server from "./../common/model.server";
import {useDevices} from "../useDevices";
import {ClientStageEvents, ServerStageEvents, ServerUserEvents} from "../common/events";
import {useRequest} from "../../useRequest";
import {
    AddGroupPayload,
    AddStagePayload,
    ChangeGroupPayload,
    ChangeStageMemberAudioProducerPayload,
    ChangeStageMemberOvTrackPayload,
    ChangeStageMemberPayload,
    ChangeStagePayload,
    JoinStagePayload,
    SetCustomGroupPayload,
    SetCustomStageMemberAudioProducerPayload,
    SetCustomStageMemberOvTrackPayload,
    SetCustomStageMemberPayload
} from "../common/payloads";
import {ThreeDimensionAudioProperties} from "../common/model.utils";
import {GroupId, StageId, StageMemberAudioProducerId, StageMemberId, StageMemberOvTrackId} from "./../common/model.server";
import {InitialNormalizedState, NormalizedState} from "./schema";
import {AdditionalReducerTypes, reducer, ReducerAction} from "./normalizer";


export interface StagesProps {
    state: NormalizedState;

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

const StagesContext = React.createContext<StagesProps>(undefined);

export const useStages = (): StagesProps => React.useContext<StagesProps>(StagesContext);

export const StagesContextConsumer = StagesContext.Consumer;

export const useStageSelector = (callback: (state: NormalizedState) => any) => {
    const {state} = useContext(StagesContext);

    const getValue = (callback) => {
        return callback(state);
    }
    return getValue(callback);
}

export const StagesContextProvider = (props: {
    children: React.ReactNode
}) => {
    const {socket, user} = useDevices();
    const {setRequest} = useRequest();

    // NORMALIZED STATE (brand *NEW*)
    const [state, dispatch] = useReducer<Reducer<NormalizedState, ReducerAction>>(reducer, InitialNormalizedState);

    useEffect(() => {
        if (user) {
            dispatch({type: ServerUserEvents.USER_READY, payload: user});
        }
    }, [user]);

    const registerSocketHandlers = useCallback(() => {
        console.log("[useStages] Registering socket handlers");
        socket.on(ServerStageEvents.STAGE_LEFT, () => {
            dispatch({type: ServerStageEvents.STAGE_LEFT});
        });
        socket.on(ServerStageEvents.STAGE_JOINED, (payload: Server.InitialStagePackage) => {
            dispatch({type: ServerStageEvents.STAGE_JOINED, payload: payload});
        });

        socket.on(ServerStageEvents.USER_ADDED, (payload: Server.User) => {
            dispatch({type: ServerStageEvents.USER_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.USER_CHANGED, (payload: Server.User) => {
            dispatch({type: ServerStageEvents.USER_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.USER_REMOVED, (payload: Server.UserId) => {
            dispatch({type: ServerStageEvents.USER_REMOVED, payload: payload});
        });

        socket.on(ServerStageEvents.STAGE_ADDED, (payload: Server.Stage) => {
            dispatch({type: ServerStageEvents.STAGE_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_CHANGED, (payload: Server.Stage) => {
            dispatch({type: ServerStageEvents.STAGE_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_REMOVED, (payload: Server.UserId) => {
            dispatch({type: ServerStageEvents.STAGE_REMOVED, payload: payload});
        });

        socket.on(ServerStageEvents.GROUP_ADDED, (payload: Server.Group) => {
            dispatch({type: ServerStageEvents.GROUP_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.GROUP_CHANGED, (payload: Server.Group) => {
            dispatch({type: ServerStageEvents.GROUP_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.GROUP_REMOVED, (payload: Server.GroupId) => {
            dispatch({type: ServerStageEvents.GROUP_REMOVED, payload: payload});
        });

        socket.on(ServerStageEvents.CUSTOM_GROUP_ADDED, (payload: Server.CustomGroup) => {
            dispatch({type: ServerStageEvents.CUSTOM_GROUP_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_CHANGED, (payload: Server.CustomGroup) => {
            dispatch({type: ServerStageEvents.CUSTOM_GROUP_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_REMOVED, (payload: Server.CustomGroupId) => {
            dispatch({type: ServerStageEvents.CUSTOM_GROUP_REMOVED, payload: payload});
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_ADDED, (payload: Server.StageMember) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_CHANGED, (payload: Server.StageMember) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_REMOVED, (payload: Server.StageMemberId) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_REMOVED, payload: payload});
        });


        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED, (payload: Server.CustomStageMember) => {
            dispatch({type: ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED, (payload: Server.CustomStageMember) => {
            dispatch({type: ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED, (payload: Server.CustomStageMemberId) => {
            dispatch({type: ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED, payload: payload});
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED, (payload: Server.StageMemberVideoProducer) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED, (payload: Server.StageMemberVideoProducer) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED, (payload: Server.StageMemberVideoProducerId) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED, payload: payload});
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED, (payload: Server.StageMemberAudioProducer) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.StageMemberAudioProducer) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.StageMemberAudioProducerId) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED, payload: payload});
        });

        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED, (payload: Server.CustomStageMemberAudioProducer) => {
            dispatch({type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.CustomStageMemberAudioProducer) => {
            dispatch({type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.CustomStageMemberAudioProducerId) => {
            dispatch({type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED, payload: payload});
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_OV_ADDED, (payload: Server.StageMemberOvTrack) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_OV_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_OV_CHANGED, (payload: Server.StageMemberOvTrack) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_OV_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_OV_REMOVED, (payload: Server.StageMemberOvTrackId) => {
            dispatch({type: ServerStageEvents.STAGE_MEMBER_OV_REMOVED, payload: payload});
        });

        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED, (payload: Server.CustomStageMemberOvTrack) => {
            dispatch({type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED, payload: payload});
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED, (payload: Server.CustomStageMemberOvTrack) => {
            dispatch({type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED, payload: payload});
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED, (payload: Server.CustomStageMemberOvTrackId) => {
            dispatch({type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED, payload: payload});
        });
    }, [socket, user]);

    useEffect(() => {
        if (socket && user) {
            registerSocketHandlers();
            return () => {
                console.log("[useStages] Cleaning up")
                dispatch({type: AdditionalReducerTypes.RESET})
            }
        }
    }, [socket, user]);

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
        if (state.current.stageId && state.current.stageId === id) {
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

    return (
        <StagesContext.Provider value={{
            state: state,

            // Methods
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
        }}>
            {props.children}
        </StagesContext.Provider>
    );
}