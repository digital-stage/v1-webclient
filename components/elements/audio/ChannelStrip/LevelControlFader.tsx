import React, {useCallback, useEffect, useState} from "react";
import LogSlider, {RGBColor} from "../LogSlider";
import {styled} from "styletron-react";
import ToggleButton from "../../../base/ToggleButton";

const Wrapper = styled("div", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
});

const VolumeAction = styled("div", {
    display: "block",
    paddingBottom: ".6rem"
})

const LevelControlFader = (
    props: {
        muted: boolean;
        volume: number;
        color?: RGBColor;
        onChanged: (volume: number, muted: boolean) => any;
        className?: string;
        alignLabel?: "left" | "right"
    }
) => {
    const [value, setValue] = useState<number>(props.volume);

    useEffect(() => {
        setValue(props.volume);
    }, [props.volume]);

    const handleMuteClicked = useCallback(() => {
        props.onChanged(value, !props.muted)
    }, [value, props.muted])

    const handleEnd = useCallback((volume: number) => {
        setValue(volume);
        props.onChanged(value, props.muted);
    }, [props.muted]);
    return (
        <Wrapper
            className={props.className}
        >
            <VolumeAction>
                <ToggleButton
                    color="primary"
                    selected={props.muted}
                    onClick={handleMuteClicked}
                    aria-label="mute"
                    size="large"
                >
                    M
                </ToggleButton>
            </VolumeAction>
            <LogSlider
                min={0}
                middle={1}
                max={4}
                width={16}
                color={props.color || [255, 255, 255]}
                volume={value}
                onChange={(volume) => setValue(volume)}
                onEnd={handleEnd}
                alignLabel={props.alignLabel}
            />
        </Wrapper>
    );
}
export default LevelControlFader;