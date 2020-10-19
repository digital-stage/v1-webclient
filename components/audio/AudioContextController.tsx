import {useAudioContext} from "../../lib/useAudioContext";
import {styled} from "baseui";
import React from "react";
import {Button} from "baseui/button";


const StartAudioOverlay = styled("div", {
    position: "absolute",
    bottom: "20%",
    left: "0",
    width: "100%",
    paddingLeft: "auto",
    paddingRight: "auto",
});

const AudioContextController = () => {
    const {audioContext, createAudioContext} = useAudioContext();

    if (!audioContext) {
        return (
            <StartAudioOverlay>
                <Button
                    onClick={() =>
                        createAudioContext().then(audioContext => {
                            if (audioContext.state === "suspended")
                                return audioContext.resume()
                        })}
                >
                    Enable Audio Playback
                </Button>
            </StartAudioOverlay>
        )
    } else if (audioContext.state === "suspended") {
        return (
            <StartAudioOverlay>
                <Button
                    onClick={() => audioContext.resume()}
                >
                    Enable Audio Playback
                </Button>
            </StartAudioOverlay>
        )
    }

    return null;
}
export default AudioContextController;