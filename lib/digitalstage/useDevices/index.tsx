import React, {useCallback, useEffect, useState} from "react";
import {Device, DeviceId, User} from "../common/model.common";
import io from "socket.io-client";
import {enumerateDevices} from "./util";
import * as Bowser from "bowser";
import {
    ClientDeviceEvents,
    ClientUserEvents,
    ServerDeviceEvents,
    ServerGlobalEvents,
    ServerUserEvents
} from "../common/events";
import {useAuth} from "../useAuth";
import {API_URL} from "../../../env";

export interface DeviceProps {
    socket: SocketIOClient.Socket;
    ready: boolean;
    localDevice?: Device;
    remoteDevices: Device[];
    user: User;

    updateDevice(id: DeviceId, device: Partial<Device>);

    updateUser(name: string, avatarUrl?: string);
}

const DeviceContext = React.createContext<DeviceProps>(undefined);

export const useDevices = (): DeviceProps => React.useContext<DeviceProps>(DeviceContext);

export const DeviceContextProvider = (props: {
    children: React.ReactNode
}) => {
    const {token} = useAuth();
    const [ready, setReady] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
    const [localDevice, setLocalDevice] = useState<Device>(undefined);
    const [remoteDevices, setRemoteDevices] = useState<Device[]>([]);

    const [localDeviceId, setLocalDeviceId] = useState<string>(undefined);
    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        if (token) {
            if (!socket) {
                console.log("[useDevices] Connecting...");
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
                                    inputAudioDevice: devices.inputAudioDevices.find(d => d.id === "label") ? "default" : devices.inputAudioDevices.length > 0 ? devices.inputAudioDevices[0].id : undefined,
                                    inputVideoDevice: devices.inputVideoDevices.length === 1 ? devices.inputVideoDevices[0].id : "default",
                                    outputAudioDevice: devices.outputAudioDevices.find(d => d.id === "label") ? "default" : devices.outputAudioDevices.length > 0 ? devices.outputAudioDevices[0].id : undefined
                                })
                            }
                        });
                        socket.on("reconnect", () => {
                            console.log("[useDevices] Reconnected!");
                        });
                        socket.on("disconnect", () => {
                            console.log("[useDevices] Disconnected from server, try to reconnect");
                            setRemoteDevices([]);
                            setLocalDevice(undefined);
                        });
                        setSocket(socket);
                        console.log("[useDevices] Connected!");
                    });
                return () => {
                    if (socket)
                        socket.removeAllListeners();
                    setSocket(undefined);
                }
            }
        }
    }, [token]);

    useEffect(() => {
        if (localDeviceId) {
            setLocalDevice(devices.find(d => d._id === localDeviceId));
            setRemoteDevices(devices.filter(d => d._id !== localDeviceId));
        } else {
            setRemoteDevices(devices);
        }
    }, [localDeviceId, devices]);


    const registerDeviceEvents = (socket) => {
        socket.on(ServerGlobalEvents.READY, () => setReady(true));
        socket.on(ServerUserEvents.USER_READY, (user) => setUser(user));
        socket.on(ServerDeviceEvents.DEVICE_ADDED, (device: Device) => setDevices(prevState => [...prevState, device]));
        socket.on(ServerDeviceEvents.DEVICE_CHANGED, (device: Device) => setDevices(prevState => prevState.map(d => d._id === device._id ? {
            ...d,
            ...device
        } : d)));
        socket.on(ServerDeviceEvents.DEVICE_REMOVED, (id: DeviceId) => setDevices(prevState => prevState.filter(device => id !== device._id)));
        socket.on(ServerDeviceEvents.LOCAL_DEVICE_READY, (localDevice: Device) => {
            setLocalDeviceId(localDevice._id);
            setDevices(prevState => [...prevState, localDevice]);
            navigator.mediaDevices.ondevicechange = () => enumerateDevices()
                .then(devices => {
                    updateDevice(localDevice._id, {
                        canAudio: devices.inputAudioDevices.length > 0,
                        canVideo: devices.inputVideoDevices.length > 0,
                        inputAudioDevices: devices.inputAudioDevices,
                        inputVideoDevices: devices.inputVideoDevices,
                        outputAudioDevices: devices.outputAudioDevices
                    });
                });
        });
        socket.on("disconnect", () => {
            setRemoteDevices([]);
            setLocalDevice(undefined);
            setReady(false);
        })
    }

    useEffect(() => {
        if (socket) {
            registerDeviceEvents(socket);

            return () => {
                console.log("[useDevices] Disconnecting from server");
                socket.disconnect();
            }
        } else {
            console.log("[useDevices] Reacting to no socket");
            setRemoteDevices([]);
            setLocalDevice(undefined);
            setDevices([]);
            setLocalDeviceId(undefined);
            setReady(false);
            setUser(undefined);
        }
    }, [socket]);

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

    return (
        <DeviceContext.Provider value={{
            socket: socket,
            ready: ready,
            user: user,
            localDevice: localDevice,
            remoteDevices: remoteDevices,
            updateDevice: updateDevice,
            updateUser: updateUser
        }}>
            {props.children}
        </DeviceContext.Provider>
    )
}