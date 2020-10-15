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
    const reduxDispatch = useDispatch();

    const registerSocketHandlers = useCallback((socket) => {
        console.log("[useStages] Registering socket handlers");

        socket.on(ServerGlobalEvents.READY, () => {
            reduxDispatch(allActions.server.setReady());
        });

        socket.on(ServerDeviceEvents.LOCAL_DEVICE_READY, (payload: Server.Device) => {
            reduxDispatch(allActions.deviceActions.server.handleLocalDeviceReady(payload));
        });

        socket.on(ServerUserEvents.USER_READY, (payload: Server.User) => {
            reduxDispatch(allActions.server.handleUserReady(payload));
        });

        socket.on(ServerDeviceEvents.DEVICE_ADDED, (payload: Server.Device) => {
            reduxDispatch(allActions.deviceActions.server.addDevice(payload));
        });
        socket.on(ServerDeviceEvents.DEVICE_CHANGED, (payload: Server.Device) => {
            reduxDispatch(allActions.deviceActions.server.changeDevice(payload));
        });
        socket.on(ServerDeviceEvents.DEVICE_REMOVED, (payload: Server.DeviceId) => {
            reduxDispatch(allActions.deviceActions.server.removeDevice(payload));
        });

        socket.on(ServerStageEvents.USER_ADDED, (payload: Server.User) => {
            reduxDispatch(allActions.stageActions.server.addUser(payload));
        });
        socket.on(ServerStageEvents.USER_CHANGED, (payload: Server.User) => {
            reduxDispatch(allActions.stageActions.server.changeUser(payload));
        });
        socket.on(ServerStageEvents.USER_REMOVED, (payload: Server.UserId) => {
            reduxDispatch(allActions.stageActions.server.removeUser(payload));
        });

        socket.on(ServerStageEvents.STAGE_ADDED, (payload: Server.Stage) => {
            reduxDispatch(allActions.stageActions.server.addStage(payload));
        });
        socket.on(ServerStageEvents.STAGE_JOINED, (payload: Server.InitialStagePackage) => {
            reduxDispatch(allActions.stageActions.server.handleStageJoined(payload));
        });
        socket.on(ServerStageEvents.STAGE_LEFT, () => {
            reduxDispatch(allActions.stageActions.server.handleStageLeft());
        });
        socket.on(ServerStageEvents.STAGE_CHANGED, (payload: Server.Stage) => {
            reduxDispatch(allActions.stageActions.server.changeStage(payload));
        });
        socket.on(ServerStageEvents.STAGE_REMOVED, (payload: Server.UserId) => {
            reduxDispatch(allActions.stageActions.server.removeStage(payload));
        });

        socket.on(ServerStageEvents.GROUP_ADDED, (payload: Server.Group) => {
            reduxDispatch(allActions.stageActions.server.addGroup(payload));
        });
        socket.on(ServerStageEvents.GROUP_CHANGED, (payload: Server.Group) => {
            reduxDispatch(allActions.stageActions.server.changeGroup(payload));
        });
        socket.on(ServerStageEvents.GROUP_REMOVED, (payload: Server.GroupId) => {
            reduxDispatch(allActions.stageActions.server.removeGroup(payload));
        });

        socket.on(ServerStageEvents.CUSTOM_GROUP_ADDED, (payload: Server.CustomGroup) => {
            reduxDispatch(allActions.stageActions.server.addCustomGroup(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_CHANGED, (payload: Server.CustomGroup) => {
            reduxDispatch(allActions.stageActions.server.changeCustomGroup(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_REMOVED, (payload: Server.CustomGroupId) => {
            reduxDispatch(allActions.stageActions.server.removeCustomGroup(payload));
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_ADDED, (payload: Server.StageMember) => {
            reduxDispatch(allActions.stageActions.server.addStageMember(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_CHANGED, (payload: Server.StageMember) => {
            reduxDispatch(allActions.stageActions.server.changeStageMember(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_REMOVED, (payload: Server.StageMemberId) => {
            reduxDispatch(allActions.stageActions.server.removeStageMember(payload));
        });

        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED, (payload: Server.CustomStageMember) => {
            reduxDispatch(allActions.stageActions.server.addCustomStageMember(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED, (payload: Server.CustomStageMember) => {
            reduxDispatch(allActions.stageActions.server.changeCustomStageMember(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED, (payload: Server.CustomStageMemberId) => {
            reduxDispatch(allActions.stageActions.server.removeCustomStageMember(payload));
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED, (payload: Server.StageMemberVideoProducer) => {
            reduxDispatch(allActions.stageActions.server.addVideoProducer(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED, (payload: Server.StageMemberVideoProducer) => {
            reduxDispatch(allActions.stageActions.server.changeVideoProducer(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED, (payload: Server.StageMemberVideoProducerId) => {
            reduxDispatch(allActions.stageActions.server.removeVideoProducer(payload));
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED, (payload: Server.StageMemberAudioProducer) => {
            reduxDispatch(allActions.stageActions.server.addAudioProducer(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.StageMemberAudioProducer) => {
            reduxDispatch(allActions.stageActions.server.changeAudioProducer(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.StageMemberAudioProducerId) => {
            reduxDispatch(allActions.stageActions.server.removeAudioProducer(payload));
        });

        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED, (payload: Server.CustomStageMemberAudioProducer) => {
            reduxDispatch(allActions.stageActions.server.addCustomAudioProducer(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.CustomStageMemberAudioProducer) => {
            reduxDispatch(allActions.stageActions.server.changeCustomAudioProducer(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.CustomStageMemberAudioProducerId) => {
            reduxDispatch(allActions.stageActions.server.removeCustomAudioProducer(payload));
        });

        socket.on(ServerStageEvents.STAGE_MEMBER_OV_ADDED, (payload: Server.StageMemberOvTrack) => {
            reduxDispatch(allActions.stageActions.server.addOvTrack(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_OV_CHANGED, (payload: Server.StageMemberOvTrack) => {
            reduxDispatch(allActions.stageActions.server.changeOvTrack(payload));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_OV_REMOVED, (payload: Server.StageMemberOvTrackId) => {
            reduxDispatch(allActions.stageActions.server.removeOvTrack(payload));
        });

        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED, (payload: Server.CustomStageMemberOvTrack) => {
            reduxDispatch(allActions.stageActions.server.addCustomOvTrack(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED, (payload: Server.CustomStageMemberOvTrack) => {
            reduxDispatch(allActions.stageActions.server.changeCustomOvTrack(payload));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED, (payload: Server.CustomStageMemberOvTrackId) => {
            reduxDispatch(allActions.stageActions.server.removeCustomOvTrack(payload));
        });
    }, [reduxDispatch]);

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
                    reduxDispatch(allActions.client.reset());
                    setSocket(undefined);
                }
            }
        }
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}