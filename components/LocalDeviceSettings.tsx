import React, {useEffect, useState} from "react";
import SingleSelect from "./atomic/SingleSelect";
import {MediaDevice, MediaDeviceId} from "../lib/digitalstage/common/model.common";

const LocalDeviceSettings = () => {
    const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);
    const [inputDevices, setInputDevices] = useState<MediaDevice[]>([]);
    const [outputDevices, setOutputDevices] = useState<MediaDevice[]>([]);
    const [videoDevice, setVideoDevice] = useState<MediaDeviceId>();
    const [inputDevice, setInputDevice] = useState<MediaDeviceId>();
    const [outputDevice, setOutputDevice] = useState<MediaDeviceId>();

    const enumerateDevices = () => {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices: MediaDevice[] = [];
                const inputDevices: MediaDevice[] = [];
                const outputDevices: MediaDevice[] = [];
                devices.forEach(device => {
                    switch (device.kind) {
                        case "audioinput":
                            // Audio Input
                            inputDevices.push({
                                id: device.groupId,
                                label: device.label ? device.label : "Eingangsgerät " + (inputDevices.length)
                            });
                            break;
                        case "videoinput":
                            // Video Input
                            videoDevices.push({
                                id: device.groupId,
                                label: device.label ? device.label : "Videogerät " + (inputDevices.length)
                            });
                            break;
                        default:
                            // Audio Output
                            outputDevices.push({
                                id: device.groupId,
                                label: device.label ? device.label : "Ausgangsgerät " + (inputDevices.length)
                            });
                            break;
                    }
                });
                console.log("DEVICES");
                console.log(inputDevices);
                console.log(outputDevices);
                setInputDevices(inputDevices);
                setVideoDevices(videoDevices);
                setOutputDevices(outputDevices);
            });
    }

    useEffect(() => {
        console.log(navigator.mediaDevices);
        navigator.mediaDevices.ondevicechange = () => {
            enumerateDevices();
        };
        enumerateDevices();
    }, []);


    return (
        <div>
            <SingleSelect
                options={inputDevices}
                id={inputDevice}
                onSelect={(id) => setInputDevice(id)}
            />
            <SingleSelect
                options={outputDevices}
                id={outputDevice}
                onSelect={(id) => setOutputDevice(id)}
            />
            <SingleSelect
                options={videoDevices}
                id={videoDevice}
                onSelect={(id) => setVideoDevice(id)}
            />
        </div>
    )
};

export default LocalDeviceSettings;