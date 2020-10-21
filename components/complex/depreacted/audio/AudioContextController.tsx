import {useAudioContext} from "../../../../lib/useAudioContext";
import {styled} from "baseui";
import React, {useCallback, useEffect, useState} from "react";
import {Button} from "baseui/button";


const StartAudioOverlay = styled("div", {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const StartAudioOverlayBox = styled("div", {
    position: "fixed",
    top: "20vh",
    left: "20vw",
    width: "60vw",
    height: "40vh",
    minHeight: "400px",
    marginLeft: "auto",
    backgroundColor: "rgba(255,0,0,0.4)",
    border: "1px solid white",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const AudioContextController = () => {
    const {audioContext, createAudioContext} = useAudioContext();
    const [valid, setValid] = useState<boolean>(audioContext && audioContext.state === "running");

    useEffect(() => {
        setValid(audioContext && audioContext.state === "running");
    }, [audioContext])

    const start = useCallback(() => {
        if (!audioContext) {
            return createAudioContext().then(audioContext => {
                if (audioContext.state === "suspended")
                    return audioContext.resume()
                        .then(() => {
                            if (audioContext.state === "running")
                                setValid(true);
                        })
            });
        } else {
            return audioContext.resume()
                .then(() => {
                    if (audioContext.state === "running")
                        setValid(true);
                })
        }
    }, [audioContext])

    if (!valid) {
        return (
            <StartAudioOverlay>
                <StartAudioOverlayBox>
                    <Button
                        size="large"
                        onClick={start}
                    >
                        Enable Audio Playback
                    </Button>
                </StartAudioOverlayBox>
            </StartAudioOverlay>
        );
    }
    return null;
}
export default AudioContextController;