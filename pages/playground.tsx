import React, {useState} from "react";
import {styled, useStyletron} from "styletron-react";
import {Checkbox} from "@material-ui/core";
import ChannelStrip from "../components/elements/audio/ChannelStrip";

const Mixer = styled("div", {
    width: "100%",
    height: "100%",
    minHeight: "600px"
});

const Playground = () => {
    const [css] = useStyletron();
    const [volume, setVolume] = useState<number>(1);
    const [muted, setMuted] = useState<boolean>(false);
    const [customVolume, setCustomVolume] = useState<number>(1);
    const [customMuted, setCustomMuted] = useState<boolean>();
    const [isAdmin, setAdmin] = useState<boolean>(false);

    return (
        <div>
            <Mixer className={css({
                display: "block",
                width: "100%",
                height: "600px"
            })}>
                <ChannelStrip
                    volume={volume}
                    muted={muted}
                    customVolume={customVolume}
                    customMuted={customMuted}
                    onVolumeChanged={(volume, muted) => {
                        setVolume(volume)
                        setMuted(muted)
                    }}
                    onCustomVolumeChanged={(volume, muted) => {
                        setCustomVolume(volume)
                        setCustomMuted(muted)
                    }}
                    onCustomVolumeReset={() => {
                        setCustomVolume(undefined)
                        setCustomMuted(undefined)
                    }}
                    isAdmin={isAdmin}
                    className={css({
                        padding: "1rem"
                    })}
                />
            </Mixer>
            <div className={css({
                display: "block",
                width: "100%"
            })}>
                <Checkbox checked={isAdmin} onChange={() => setAdmin(prev => !prev)}/> isAdmin
            </div>
        </div>
    )
}
export default Playground;