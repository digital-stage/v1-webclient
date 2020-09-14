import {MediaDevice} from "../useSocket/model.common";

export const enumerateDevices = (): Promise<{
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