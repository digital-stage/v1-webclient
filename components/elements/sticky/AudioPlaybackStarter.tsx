import {useAudioContext} from "../../../lib/useAudioContext";
import React, {useCallback, useEffect, useState} from "react";
import Icon2 from "../../base/Icon2";
import {useStyletron} from "styletron-react";
import useTheme from "@material-ui/core/styles/useTheme";
import IconButton from "../../base/IconButton";


const AudioPlaybackStarter = () => {
    const [css] = useStyletron();
    const {palette, breakpoints} = useTheme();
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
            <div className={css({
                position: "fixed",
                bottom: "1rem",
                left: "1rem",
                color: palette.warning.main,

                [breakpoints.up("md")]: {
                    left: "4rem",
                }
            })}>
                <IconButton color="inherit" onClick={() => start()}>
                    <Icon2 className={css({
                        color: palette.warning.main,
                        ":hover": {
                            color: palette.warning.dark
                        }
                    })} size={64} name="speaker-off"/>
                </IconButton>
            </div>
        );
    }
    return null;
}
export default AudioPlaybackStarter;