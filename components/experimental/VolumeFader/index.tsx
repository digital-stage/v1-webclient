import React, {useEffect} from "react";
import LevelMeter from "./LevelMeter";
import {styled} from "baseui";
import {IAnalyserNode, IAudioContext} from "standardized-audio-context";
import VolumeSlider from "./VolumeSlider";

const Wrapper = styled("div", {
    position: "relative",
    width: "100px",
    height: "300px",
    border: "1px solid blue",
    display: 'flex',
    flexDirection: 'row'
});

const VolumeFader = (
    props: {
        volume: number;
        analyser?: IAnalyserNode<IAudioContext>;
        onVolumeChanged?: (volume: number) => void;
        sliderColor?: string;
        colorize?: boolean;
    }
) => {

    return (
        <Wrapper>
            {props.analyser && <LevelMeter analyser={props.analyser}/>}
            <VolumeSlider
                min={0}
                max={1}
                step={0.05}
                color={props.sliderColor}
                colorize={props.colorize}
                value={props.volume}
                onEnd={(volume) => {
                    if (props.onVolumeChanged)
                        props.onVolumeChanged(volume)
                }}
            />
        </Wrapper>
    );
}
export default VolumeFader;