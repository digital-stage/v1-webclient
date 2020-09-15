import React, {useCallback, useEffect, useState} from "react";
import {Device, DeviceId} from "../useSocket/model.common";
import io from "socket.io-client";
import {enumerateDevices} from "./util";
import * as Bowser from "bowser";
import {ClientDeviceEvents, ServerDeviceEvents} from "../useSocket/events";
import {useAuth} from "../useAuth";
import {API_URL} from "../../env";

export interface DeviceProps {
    socket: SocketIOClient.Socket;
    localDevice: Device;
    devices: Device[];
    remoteDevices: Device[];

    updateDevice(id: DeviceId, device: Partial<Device>);
}

const DeviceContext = React.createContext<DeviceProps>(undefined);

export const useDevices = (): DeviceProps => React.useContext<DeviceProps>(DeviceContext);


let isSocketInitialized = false;

export const DeviceContextProvider = (props: {
    children: React.ReactNode
}) => {
    const {token} = useAuth();
    const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
    const [localDeviceId, setLocalDeviceId] = useState<string>();
    const [localDevice, setLocalDevice] = useState<Device>();
    const [devices, setDevices] = useState<Device[]>([]);
    const [remoteDevices, setRemoteDevices] = useState<Device[]>([]);

    useEffect(() => {
        if (token) {
            console.log("TOKEN");
            const bowser = Bowser.getParser(window.navigator.userAgent);
            const os = bowser.getOSName();
            const browser = bowser.getBrowserName();
            enumerateDevices()
                .then(devices => {
                    const socketIO: SocketIOClient.Socket = io(API_URL, {
                        transports: ['websocket'],
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
                                inputAudioDevice: "default",
                                inputVideoDevice: devices.inputVideoDevices.length === 1 ? devices.inputVideoDevices[0].id : "default",
                                outputAudioDevice: "default"
                            })
                        }
                    });
                    setSocket(socketIO);
                });
        }
    }, [token]);

    useEffect(() => {
        // Update local and remote devices
        if (localDeviceId) {
            const localDevice = devices.find(device => device._id === localDeviceId);
            setLocalDevice(prevState => ({
                ...prevState,
                ...localDevice
            }));
            setRemoteDevices(devices.filter(device => device._id !== localDeviceId));
        } else {
            setLocalDevice(undefined);
            setRemoteDevices(devices);
        }
    }, [devices, localDeviceId]);

    const updateDevice = useCallback((deviceId: string, device: Partial<Omit<Device, "_id">>) => {
        if (socket) {
            console.log("UPDATE-DEVICE");
            console.log(device);
            socket.emit(ClientDeviceEvents.UPDATE_DEVICE, {
                ...device,
                _id: deviceId
            });
        } else {
            console.error("SOCKET NOT READY");
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            console.log("useDevice: socket changed");
            if (!isSocketInitialized) {
                console.log("Register device changes");
                socket.on("disconnect", () => {
                    setSocket(undefined);
                });
                socket.on(ServerDeviceEvents.DEVICE_ADDED, () => console.log("device-added"));
                socket.on(ServerDeviceEvents.DEVICE_ADDED, (device: Device) => setDevices(prevState => [...prevState, device]));
                socket.on(ServerDeviceEvents.DEVICE_CHANGED, (device: Device) => setDevices(prevState => prevState.map(d => d._id === device._id ? {...d, ...device} : d)));
                socket.on(ServerDeviceEvents.DEVICE_REMOVED, (device: Device) => setDevices(prevState => prevState.filter(d => d._id !== device._id)));
                socket.on(ServerDeviceEvents.LOCAL_DEVICE_READY, (device: Device) => {
                    console.log("local-device-ready");
                    console.log(device);
                    setLocalDeviceId(device._id);
                    setDevices(prevState => [...prevState, device]);
                    navigator.mediaDevices.ondevicechange = () => enumerateDevices()
                        .then(devices => {
                            updateDevice(device._id, {
                                canAudio: devices.inputAudioDevices.length > 0,
                                canVideo: devices.inputVideoDevices.length > 0,
                                inputAudioDevices: devices.inputAudioDevices,
                                inputVideoDevices: devices.inputVideoDevices,
                                outputAudioDevices: devices.outputAudioDevices
                            });
                        });
                });
            }
            isSocketInitialized = true;
        } else {
            setLocalDeviceId(undefined);
            setLocalDevice(undefined);
            setRemoteDevices([]);
            setDevices([]);
        }
    }, [socket]);

    return (
        <DeviceContext.Provider value={{
            socket: socket,
            localDevice: localDevice,
            devices: devices,
            remoteDevices: remoteDevices,
            updateDevice: updateDevice
        }}>
            {props.children}
        </DeviceContext.Provider>
    )
}