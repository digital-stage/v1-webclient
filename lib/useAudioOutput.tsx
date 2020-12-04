import {useLocalDevice} from "./use-digital-stage/hooks";
import {useEffect, useState} from "react";
import useAudioContext from "./useAudioContext";

const useAudioOutput = (): void => {
    const localDevice = useLocalDevice();
    const [outputAudioDeviceId, setOutputAudioDeviceId] = useState<string>();
    const {setSinkId} = useAudioContext();

    useEffect(() => {
        setSinkId(outputAudioDeviceId);
    }, [outputAudioDeviceId])

    // HANDLE OUTPUT CHANGE
    useEffect(() => {
        if (localDevice && localDevice.outputAudioDeviceId !== outputAudioDeviceId) {
            setOutputAudioDeviceId(localDevice.outputAudioDeviceId);
        }
    }, [localDevice]);
}

export default useAudioOutput;
