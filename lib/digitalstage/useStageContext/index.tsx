import React, {useCallback, useEffect, useState} from "react";
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
import allActions from "./redux/actions";
import {useDispatch} from "./redux";

export interface SocketContextProps {
    socket?: SocketIOClient.Socket;
}

const SocketContext = React.createContext<SocketIOClient.Socket>(undefined);

export const useSocket = (): SocketIOClient.Socket => React.useContext<SocketIOClient.Socket>(SocketContext);

export const SocketContextProvider = (props: {
    children: React.ReactNode
}) => {
    const {token} = useAuth();
    const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
    const dispatch = useDispatch();

    const registerSocketHandlers = useCallback((socket) => {
        console.log("[useStages] Registering socket handlers");

        socket.on(ServerGlobalEvents.READY, () => {
            dispatch(allActions.server.setReady());
        });

        socket.on(ServerDeviceEvents.LOCAL_DEVICE_READY, (payload: Server.Device) => {
            dispatch(allActions.deviceActions.server.handleLocalDeviceReady(payload));
        });

        socket.on(ServerUserEvents.USER_READY, (payload: Server.User) => {
            dispatch(allActions.server.handleUserReady(payload));
        });

        socket.on(ServerDeviceEvents.DEVICE_ADDED, (payload: Server.Device) => {
            dispatch(allActions.deviceActions.server.addDevice(payload));
        });
        socket.on(ServerDeviceEvents.DEVICE_CHANGED, (payload: Server.Device) => {
            dispatch(allActions.deviceActions.server.changeDevice(payload));
        });
        socket.on(ServerDeviceEvents.DEVICE_REMOVED, (payload: Server.DeviceId) => {
            dispatch(allActions.deviceActions.server.removeDevice(payload));
        });

        socket.on(ServerStageEvents.USER_ADDED, (payload: Server.User) => {
            dispatch(allActions.stageActions.server.addUser(payload));
        });
        socket.on(ServerStageEvents.USER_CHANGED, (payload: Server.User) => {
            dispatch(allActions.stageActions.server.changeUser(payload));
        });
        socket.on(ServerStageEvents.USER_REMOVED, (payload: Server.UserId) => {
            dispatch(allActions.stageActions.server.removeUser(payload));
        });

        socket.on(ServerStageEvents.STAGE_ADDED, (payload: Server.Stage) => {
            dispatch(allActions.stageActions.server.addStage(payload));
        });
        socket.on(ServerStageEvents.STAGE_JOINED, (payload: Server.InitialStagePackage) => {
            dispatch(allActions.stageActions.server.handleStageJoined(payload));
        });
        socket.on(ServerStageEvents.STAGE_LEFT, () => {
            dispatch(allActions.stageActions.server.handleStageLeft());
        });
        socket.on(ServerStageEvents.STAGE_CHANGED, (payload: Server.Stage) => {
            dispatch(allActions.stageActions.server.changeStage(payload));
        });
        socket.on(ServerStageEvents.STAGE_REMOVED, (payload: Server.UserId) => {
            dispatch(allActions.stageActions.server.removeStage(payload));
        });

        socket.on(ServerStageEvents.GROUP_ADDED, (payload: Server.Group) => {
            dispatch(allActions.stageActions.server.addGroup(payload));
        });
        socket.on(ServerStageEvents.GROUP_CHANGED, (payload: Server.Group) => {
            dispatch(allActions.stageActions.server.changeGroup(payload));
        });
        socket.on(ServerStageEvents.GROUP_REMOVED, (payload: Server.GroupId) => {
            dispatch(allActions.stageActions.server.removeGroup(payload));
        });

        socket.on(ServerStageEvents.CUSTOM_GROUP_ADDED, (payload: Server.CustomGroup) => {
            dispatch(allActions.stageActions.server.addCustomGroup(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_CHANGED, (payload: Server.CustomGroup) => {
            dispatch(allActions.stageActions.server.changeCustomGroup(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_REMOVED, (payload: Server.CustomGroupId) => {
            dispatch(allActions.stageActions.server.removeCustomGroup(payload));
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_ADDED, (payload: Server.StageMember) => {
            dispatch(allActions.stageActions.server.addStageMember(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_CHANGED, (payload: Server.StageMember) => {
            dispatch(allActions.stageActions.server.changeStageMember(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_REMOVED, (payload: Server.StageMemberId) => {
            dispatch(allActions.stageActions.server.removeStageMember(payload));
        });

        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED, (payload: Server.CustomStageMember) => {
            dispatch(allActions.stageActions.server.addCustomStageMember(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED, (payload: Server.CustomStageMember) => {
            dispatch(allActions.stageActions.server.changeCustomStageMember(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED, (payload: Server.CustomStageMemberId) => {
            dispatch(allActions.stageActions.server.removeCustomStageMember(payload));
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED, (payload: Server.StageMemberVideoProducer) => {
            dispatch(allActions.stageActions.server.addVideoProducer(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED, (payload: Server.StageMemberVideoProducer) => {
            dispatch(allActions.stageActions.server.changeVideoProducer(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED, (payload: Server.StageMemberVideoProducerId) => {
            dispatch(allActions.stageActions.server.removeVideoProducer(payload));
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED, (payload: Server.StageMemberAudioProducer) => {
            dispatch(allActions.stageActions.server.addAudioProducer(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.StageMemberAudioProducer) => {
            dispatch(allActions.stageActions.server.changeAudioProducer(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.StageMemberAudioProducerId) => {
            dispatch(allActions.stageActions.server.removeAudioProducer(payload));
        });

        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED, (payload: Server.CustomStageMemberAudioProducer) => {
            dispatch(allActions.stageActions.server.addCustomAudioProducer(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.CustomStageMemberAudioProducer) => {
            dispatch(allActions.stageActions.server.changeCustomAudioProducer(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.CustomStageMemberAudioProducerId) => {
            dispatch(allActions.stageActions.server.removeCustomAudioProducer(payload));
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_OV_ADDED, (payload: Server.StageMemberOvTrack) => {
            dispatch(allActions.stageActions.server.addOvTrack(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_OV_CHANGED, (payload: Server.StageMemberOvTrack) => {
            dispatch(allActions.stageActions.server.changeOvTrack(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_OV_REMOVED, (payload: Server.StageMemberOvTrackId) => {
            dispatch(allActions.stageActions.server.removeOvTrack(payload));
        });

        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED, (payload: Server.CustomStageMemberOvTrack) => {
            dispatch(allActions.stageActions.server.addCustomOvTrack(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED, (payload: Server.CustomStageMemberOvTrack) => {
            dispatch(allActions.stageActions.server.changeCustomOvTrack(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED, (payload: Server.CustomStageMemberOvTrackId) => {
            dispatch(allActions.stageActions.server.removeCustomOvTrack(payload));
        });
    }, [dispatch]);


    const createSocket = useCallback(() => {
        console.log("[useStageContext] Creating socket connection...");
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
                console.log("[useStageContext] Created socket connection!");
            });
    }, [token]);

    useEffect(() => {
        if( socket ) {
            return () => {
                console.log("[useStageContext] Closing socket connection...");
                socket.removeAllListeners();
                socket.close();
                setSocket(undefined);
                dispatch(allActions.client.reset());
                console.log("[useStageContext] Closed socket connection!");
            }
        }
    }, [socket]);

    useEffect(() => {
        if (token) {
            createSocket();
        } else {
            console.log("[useStageContext] token is null -> clearing socket");
            setSocket(undefined);
        }
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}