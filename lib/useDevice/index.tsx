import {useSocket} from "../useSocket";
import {useCallback, useEffect, useState} from "react";
import {Device} from "../useStage/model.common";

export const useDevice = () => {
    const {socket} = useSocket();
    const [localDevice, setLocalDevice] = useState<Device>();
    const [remoteDevices, setRemoteDevices] = useState<Device[]>([]);

    useEffect(() => {
        if (socket) {
            socket.on("device-ready", (device: Device) => {
                setLocalDevice(device);
            });
            socket.on("device-added", (device: Device) => {
                console.log("device-added");
                setRemoteDevices(prevState => [...prevState, device]);
            });
            socket.on("device-removed", (device: Device) => {
                console.log("device-removed");
                setRemoteDevices(prevState => prevState.filter(d => d._id !== device._id));
            });
        }
    }, [socket]);

    useEffect(() => {
        if (socket && localDevice) {
            socket.on("device-changed", (device: Device) => {
                console.log("handleDeviceChanged");
                console.log(device.sendVideo);
                console.log(localDevice);
                if (localDevice && localDevice._id === device._id) {
                    console.log("local-device");
                    setLocalDevice(prevState => ({...prevState, ...device}));
                } else {
                    console.log("remote-device");
                    setRemoteDevices(prevState => prevState.map(d => d._id === device._id ? device : d));
                }
            });
        }
    }, [socket, localDevice]);

    const updateDevice = useCallback((deviceId: string, device: Partial<Omit<Device, "_id">>) => {
        if (socket) {
            socket.emit("update-device", {
                ...device,
                _id: deviceId
            });
        }
    }, [socket]);

    return {localDevice, remoteDevices, updateDevice};
}