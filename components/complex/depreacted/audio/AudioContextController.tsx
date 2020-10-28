import {useAudioContext} from "../../../../lib/useAudioContext";
import {styled} from "baseui";
import React, {useCallback, useEffect, useState} from "react";
import Icon2 from "../../../base/Icon2";
import {IconButton, withStyles} from "@material-ui/core";

const StartAudioOverlay = styled("div", {
    position: "fixed",
    bottom: "1rem",
    left: "1rem"
});
const StartAudioButton = withStyles({})(IconButton);

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
                <StartAudioButton onClick={() => start()}>
                    <Icon2 name="speaker-off"/>
                </StartAudioButton>
            </StartAudioOverlay>
        );
    }
    return null;
}
export default AudioContextController;