import React, {useCallback, useEffect, useState} from "react";
import LogSlider, {RGBColor} from "../LogSlider";
import {styled} from "styletron-react";
import ToggleButton from "../../../base/ToggleButton";

const Wrapper = styled("div", {
    display: "block"
});

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
        <Wrapper>
            <ToggleButton
                color="primary"
                selected={props.muted}
                onClick={handleMuteClicked}
                aria-label="mute"
            >
                MUTE
            </ToggleButton>
            <LogSlider
                className={props.className}
                min={0}
                middle={1}
                max={4}
                width={16}
                color={props.color || [255, 255, 255]}
                volume={value}
                onChange={(volume) => setValue(volume)}
                onEnd={handleEnd}
                alignLabel={props.alignLabel}
                vertical={true}
            />
        </Wrapper>
    );
}
export default LevelControlFader;