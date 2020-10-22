import React, {Context, createContext, useCallback, useContext, useEffect, useState} from "react";
import {AudioContext as RealAudioContext, IAudioContext} from "standardized-audio-context";
import webAudioTouchUnlock from "./webAudioTouchUnlock";

interface AudioContextProps {
    audioContext?: IAudioContext,

    createAudioContext(): Promise<IAudioContext>
}

const AudioContext: Context<AudioContextProps> = createContext<AudioContextProps>(undefined);

export const AudioContextProvider = (props: {
    children: React.ReactNode
}) => {
    const [running, setRunning] = useState<boolean>(false);
    const [context, setContext] = useState<IAudioContext>(undefined);

    const createAudioContext = useCallback(async () => {
        if (context) {
            return context;
        }
        const audioContext: IAudioContext = new RealAudioContext();
        console.log("Base latency with sample rate " + audioContext.sampleRate + ": " + Math.round(1000 * audioContext.baseLatency) + "ms");

        if( audioContext.state !== "running" ) {
            setRunning(false)
        } else {
            setRunning(true)
        }

        return webAudioTouchUnlock(audioContext)
            .then((unlocked: boolean) => {
                return audioContext;
            });
    }, []);

    useEffect(() => {
        createAudioContext()
            .then((audioContext) => {
                console.log("Audio engine initialized");
                setContext(audioContext);
            })
            .catch(() => {
                console.error("eerror")
            })
    }, []);

    return (
        <AudioContext.Provider value={{
            audioContext: context,
            createAudioContext: createAudioContext
        }}>
            {props.children}
        </AudioContext.Provider>
    );
};

export const useAudioContext = () => useContext<AudioContextProps>(AudioContext);
