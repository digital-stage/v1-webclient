import React, {useEffect, useState} from "react";
import SingleSelect from "../theme/form/SingleSelect";
import {WebRTCDevice, WebRTCDeviceId} from "../../lib/digitalstage/common/model.server";

const LocalDeviceSettings = () => {
    const [videoDevices, setVideoDevices] = useState<WebRTCDevice[]>([]);
    const [inputDevices, setInputDevices] = useState<WebRTCDevice[]>([]);
    const [outputDevices, setOutputDevices] = useState<WebRTCDevice[]>([]);
    const [videoDevice, setVideoDevice] = useState<WebRTCDeviceId>();
    const [inputDevice, setInputDevice] = useState<WebRTCDeviceId>();
    const [outputDevice, setOutputDevice] = useState<WebRTCDeviceId>();

    const enumerateDevices = () => {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices: WebRTCDevice[] = [];
                const inputDevices: WebRTCDevice[] = [];
                const outputDevices: WebRTCDevice[] = [];
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