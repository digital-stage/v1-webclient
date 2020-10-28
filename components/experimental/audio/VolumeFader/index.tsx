import React, {useEffect, useState} from "react";
import LevelMeter from "../LevelMeter";
import {styled} from "baseui";
import {IAnalyserNode, IAudioContext} from "standardized-audio-context";
import LogSlider, {RGBColor} from "../LogSlider";

const Wrapper = styled("div", {
    position: "relative",
    width: "100%",
    height: "100%",
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-evenly'
});

const LevelContainer = styled("div", {
    width: "20px",
    height: "100%"
});

const VolumeFader = (
    props: {
        volume: number;
        analyser?: IAnalyserNode<IAudioContext>;
        color?: RGBColor;
        onVolumeChanged?: (volume: number) => any;
    }
) => {
    const [value, setValue] = useState<number>(props.volume);

    useEffect(() => {
        setValue(props.volume);
    }, [props.volume]);

    return (
        <Wrapper>
            <LogSlider
                min={0}
                middle={1}
                max={4}
                width={16}
                color={props.color || [255, 255, 255]}
                volume={value}
                onChange={(volume) => setValue(volume)}
                onEnd={(volume) => {
                    setValue(volume);
                    if (props.onVolumeChanged)
                        props.onVolumeChanged(volume)
                }}
                vertical={true}
            />
            {props.analyser && <LevelContainer><LevelMeter analyser={props.analyser}/></LevelContainer>}
        </Wrapper>
    );
}
export default VolumeFader;