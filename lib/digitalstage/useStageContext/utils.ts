import {WebRTCDevice} from "../common/model.server";
import {NormalizedState} from "./schema";
import _ from "lodash";

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

export const upsert = function <T>(arr: T[], value: T): T[] {
    if (_.indexOf(arr, value) === -1) {
        arr.push(value);
    }
    return arr;
}


export const updateItem = (state: NormalizedState, group: string, id: string, payload: any): NormalizedState => {
    return {
        ...state,
        [group]: {
            ...state[group],
            byId: {
                ...state[group].byId,
                [id]: {
                    ...state[group].byId[id],
                    ...payload
                }
            }
        }
    };
}
export const removeItem = (state: NormalizedState, group: string, id: string): NormalizedState => {
    return {
        ...state,
        [group]: {
            ...state[group],
            byId: _.omit(state[group].byId, id),
            allIds: state[group].allIds.filter(el => el !== id)
        }
    }
}

export const removeItemWithArrayReference = (state: NormalizedState, group: string, id: string, reference: {
    group: string;
    id: string;
    key: string;
}): NormalizedState => {
    return {
        ...state,
        [reference.group]: {
            ...state[reference.group],
            byId: {
                ...state[reference.group].byId,
                [reference.id]: {
                    ...state[reference.group].byId[reference.id],
                    [reference.key]: state[reference.group].byId[reference.id][reference.key].filter(refId => refId !== id)
                }
            }
        },
        [group]: {
            byId: _.omit(state[group].byId, id),
            allIds: state[group].allIds.filter(el => el !== id)
        }
    };
}

export const removeItemWithReference = (state: NormalizedState, group: string, id: string, reference: {
    group: string;
    id: string;
    key: string;
}): NormalizedState => {
    return {
        ...state,
        [reference.group]: {
            ...state[reference.group],
            byId: {
                ...state[reference.group].byId,
                [reference.id]: {
                    ...state[reference.group].byId[reference.id],
                    [reference.key]: undefined
                }
            }
        },
        [group]: {
            byId: _.omit(state[group].byId, id),
            allIds: state[group].allIds.filter(el => el !== id)
        }
    };
}
