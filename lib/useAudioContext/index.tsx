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
    const [context, setContext] = useState<IAudioContext>(undefined);

    const createAudioContext = useCallback(async () => {
        if (context) {
            return context;
        }
        const audioContext: IAudioContext = new RealAudioContext();

        console.log("Base latency with sample rate " + audioContext.sampleRate + ": " + Math.round(1000 * audioContext.baseLatency) + "ms");
        return webAudioTouchUnlock(audioContext)
            .then((unlocked: boolean) => {
                if (unlocked) {
                    // AudioContext was unlocked from an explicit user action, sound should start playing now
                } else {
                    // There was no need for unlocking, devices other than iOS
                }
                setContext(audioContext);
                return audioContext;
            });
    }, []);

    useEffect(() => {
        createAudioContext()
            .then(() => console.log("Audio engine initialized"))
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
