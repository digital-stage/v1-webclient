import {useSocket} from "../useSocket";
import React, {useCallback, useEffect, useState} from "react";
import {Device, DeviceId, MediaDevice} from "../useSocket/model.common";

export interface DeviceProps {
    localDevice: Device;
    devices: Device[];
    remoteDevices: Device[];

    updateDevice(id: DeviceId, device: Partial<Device>);
}

const DeviceContext = React.createContext<DeviceProps>(undefined);

export const useDevices = (): DeviceProps => React.useContext<DeviceProps>(DeviceContext);

const enumerateDevices = (): Promise<{
    inputAudioDevices: MediaDevice[],
    inputVideoDevices: MediaDevice[],
    outputAudioDevices: MediaDevice[],
}> => {
    return new Promise<{
        inputAudioDevices: MediaDevice[],
        inputVideoDevices: MediaDevice[],
        outputAudioDevices: MediaDevice[]
    }>(resolve => {
        if (!navigator)
            return resolve({
                inputAudioDevices: [],
                inputVideoDevices: [],
                outputAudioDevices: [],
            });
        return navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const inputVideoDevices: MediaDevice[] = [];
                const inputAudioDevices: MediaDevice[] = [];
                const outputAudioDevices: MediaDevice[] = [];
                devices.forEach(device => {
                    switch (device.kind) {
                        case "videoinput":
                            inputVideoDevices.push({
                                id: device.deviceId,
                                label: device.label
                            });
                            break;
                        case "audioinput":
                            inputAudioDevices.push({
                                id: device.deviceId,
                                label: device.label
                            });
                            break;
                        default:
                            outputAudioDevices.push({
                                id: device.deviceId,
                                label: device.label
                            });
                            break;
                    }
                });
                resolve({
                    inputAudioDevices,
                    inputVideoDevices,
                    outputAudioDevices
                })
            });
    });
}

let isSocketInitialized = false;

export const DeviceContextProvider = (props: {
    children: React.ReactNode
}) => {
    const socket = useSocket();
    const [localDeviceId, setLocalDeviceId] = useState<string>();
    const [localDevice, setLocalDevice] = useState<Device>();
    const [devices, setDevices] = useState<Device[]>([]);
    const [remoteDevices, setRemoteDevices] = useState<Device[]>([]);

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
            socket.emit("update-device", {
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
                socket.on("device-added", (device: Device) => setDevices(prevState => [...prevState, device]));
                socket.on("device-changed", (device: Device) => setDevices(prevState => prevState.map(d => d._id === device._id ? {...d, ...device} : d)));
                socket.on("device-removed", (device: Device) => setDevices(prevState => prevState.filter(d => d._id !== device._id)));
                socket.on("local-device-ready", (device: Device) => {
                    console.log(device);
                    setLocalDeviceId(device._id);
                    setDevices(prevState => [...prevState, device]);
                    // Now commit the changes
                    enumerateDevices()
                        .then(devices => {
                            updateDevice(device._id, {
                                canAudio: devices.inputAudioDevices.length > 0,
                                canVideo: devices.inputVideoDevices.length > 0,
                                inputAudioDevices: devices.inputAudioDevices,
                                inputVideoDevices: devices.inputVideoDevices,
                                outputAudioDevices: devices.outputAudioDevices,
                                inputAudioDevice: "default",
                                inputVideoDevice: devices.inputVideoDevices.length === 1 ? devices.inputVideoDevices[0].id : "default",
                                outputAudioDevice: "default"
                            });
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
                });
            }
            isSocketInitialized = true;
        }
    }, [socket]);

    return (
        <DeviceContext.Provider value={{
            localDevice: localDevice,
            devices: devices,
            remoteDevices: remoteDevices,
            updateDevice: updateDevice
        }}>
            {props.children}
        </DeviceContext.Provider>
    )
}