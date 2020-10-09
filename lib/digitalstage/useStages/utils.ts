import {WebRTCDevice} from "../common/model.server";

export const enumerateDevices = (): Promise<{
    inputAudioDevices: WebRTCDevice[],
    inputVideoDevices: WebRTCDevice[],
    outputAudioDevices: WebRTCDevice[],
}> => {
    return new Promise<{
        inputAudioDevices: WebRTCDevice[],
        inputVideoDevices: WebRTCDevice[],
        outputAudioDevices: WebRTCDevice[]
    }>(resolve => {
        if (!navigator)
            return resolve({
                inputAudioDevices: [],
                inputVideoDevices: [],
                outputAudioDevices: [],
            });
        return navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const inputVideoDevices: WebRTCDevice[] = [];
                const inputAudioDevices: WebRTCDevice[] = [];
                const outputAudioDevices: WebRTCDevice[] = [];
                devices.forEach((device, index) => {
                    switch (device.kind) {
                        case "videoinput":
                            inputVideoDevices.push({
                                id: device.deviceId || (inputVideoDevices.length === 1 ? "default" : index.toString()),
                                label: device.label ? device.label : "Standard"
                            });
                            break;
                        case "audioinput":
                            inputAudioDevices.push({
                                id: device.deviceId || (inputAudioDevices.length === 1 ? "default" : index.toString()),
                                label: device.label || "Standard"
                            });
                            break;
                        default:
                            outputAudioDevices.push({
                                id: device.deviceId || (outputAudioDevices.length === 1 ? "default" : index.toString()),
                                label: device.label || "Standard"
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