import React, {Reducer, useCallback, useEffect, useMemo, useReducer, useState} from "react";
import {InitialNormalizedState, NormalizedState} from "./schema";
import {AdditionalReducerTypes, reducer, ReducerAction} from "./normalizer";
import {useAuth} from "../useAuth";
import {
    ServerDeviceEvents,
    ServerGlobalEvents,
    ServerStageEvents,
    ServerUserEvents
} from "../common/events";
import * as Server from "../common/model.server";
import * as Bowser from "bowser";
import io from "socket.io-client";
import {API_URL} from "../../../env";
import {enumerateDevices} from "./utils";
import {Device} from "../common/model.server";

export interface StagesProps {
    socket?: SocketIOClient.Socket;
    state: NormalizedState;
    dispatch?: React.Dispatch<ReducerAction>
}

const StagesContext = React.createContext<StagesProps>({
    state: InitialNormalizedState,
    dispatch: undefined,
    socket: undefined
});

//TODO: Separate socket, state and dispatch using encapsulated contextes !!!!
export const useStageContext = (): StagesProps => React.useContext<StagesProps>(StagesContext);

export const StagesContextConsumer = StagesContext.Consumer;


export const StagesContextProvider = (props: {
    children: React.ReactNode
}) => {
    const {token} = useAuth();
    const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
    const [state, dispatch] = useReducer<Reducer<NormalizedState, ReducerAction>>(reducer, InitialNormalizedState);


    const registerSocketHandlers = useCallback((socket) => {
        console.log("[useStages] Registering socket handlers");

        socket.on(ServerGlobalEvents.READY, () =>
            dispatch({type: ServerGlobalEvents.READY})
        );

        socket.on(ServerDeviceEvents.LOCAL_DEVICE_READY, (payload: Server.Device) => {
            dispatch({type: ServerDeviceEvents.LOCAL_DEVICE_READY, payload: payload});
        });

        socket.on(ServerUserEvents.USER_READY, (payload: Server.User) => dispatch({
            type: ServerUserEvents.USER_READY,
            payload
        }));

        socket.on(ServerDeviceEvents.DEVICE_ADDED, (payload: Server.Device) => {
            dispatch({type: ServerDeviceEvents.DEVICE_ADDED, payload: payload});
        });
        socket.on(ServerDeviceEvents.DEVICE_CHANGED, (payload: Server.Device) => {
            dispatch({type: ServerDeviceEvents.DEVICE_CHANGED, payload: payload});
        });
        socket.on(ServerDeviceEvents.DEVICE_REMOVED, (payload: Server.DeviceId) => {
            dispatch({type: ServerDeviceEvents.DEVICE_REMOVED, payload: payload});
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
        socket.on(ServerStageEvents.STAGE_JOINED, (payload: Server.InitialStagePackage) => {
            dispatch({type: ServerStageEvents.STAGE_JOINED, payload: payload});
        });
        socket.on(ServerStageEvents.STAGE_LEFT, () => {
            dispatch({type: ServerStageEvents.STAGE_LEFT});
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
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            if (!socket) {
                console.log("[useStageContext] Connecting...");
                const bowser = Bowser.getParser(window.navigator.userAgent);
                const os = bowser.getOSName();
                const browser = bowser.getBrowserName();

                enumerateDevices()
                    .then(devices => {
                        const socket = io(API_URL, {
                            secure: process.env.NODE_ENV !== "development",
                            query: {
                                token: token,
                                device: JSON.stringify({
                                    name: browser + " (" + os + ")",
                                    canAudio: devices.inputAudioDevices.length > 0,
                                    canVideo: devices.inputVideoDevices.length > 0,
                                    inputAudioDevices: devices.inputAudioDevices,
                                    inputVideoDevices: devices.inputVideoDevices,
                                    outputAudioDevices: devices.outputAudioDevices,
                                    inputAudioDeviceId: devices.inputAudioDevices.find(d => d.id === "label") ? "default" : devices.inputAudioDevices.length > 0 ? devices.inputAudioDevices[0].id : undefined,
                                    inputVideoDeviceId: devices.inputVideoDevices.length === 1 ? devices.inputVideoDevices[0].id : "default",
                                    outputAudioDeviceId: devices.outputAudioDevices.find(d => d.id === "label") ? "default" : devices.outputAudioDevices.length > 0 ? devices.outputAudioDevices[0].id : undefined
                                } as Device)
                            }
                        });

                        registerSocketHandlers(socket);

                        socket.on("reconnect", () => {
                            console.log("[useStageContext] Reconnected!");
                        });
                        socket.on("disconnect", () => {
                            console.log("[useStageContext] Disconnected from server, try to reconnect");
                        });

                        setSocket(socket);
                        console.log("[useStageContext] Connected!");
                    });
                return () => {
                    if (socket) {
                        socket.removeAllListeners();
                    }
                    dispatch({type: AdditionalReducerTypes.RESET});
                    setSocket(undefined);
                }
            }
        }
    }, [token]);

    const contextValue = useMemo(() => {
        return { state, dispatch, socket };
    }, [state, dispatch, socket]);

    return (
        <StagesContext.Provider value={contextValue}>
            {props.children}
        </StagesContext.Provider>
    );
}