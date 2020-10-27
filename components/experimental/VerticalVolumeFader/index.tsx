import {IAnalyserNode, IAudioContext} from "standardized-audio-context";
import LevelMeter from "../LevelMeter";
import {styled} from "styletron-react";
import VolumeSlider from "./VolumeSlider";
import React, {useEffect, useState} from "react";

const Wrapper = styled("div", {
    position: "relative",
    width: "100%",
    height: "20px"
})
const ChildWrapper = styled("div", {
    position: "absolute",
    display: "block",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
})


const VerticalVolumeFader = (
    props: {
        volume: number;
        analyser?: IAnalyserNode<IAudioContext>;
        onVolumeChanged?: (volume: number) => void;
        sliderColor?: string;
        colorize?: boolean;
    }) => {
    const [value, setValue] = useState<number>(props.volume);

    useEffect(() => {
        setValue(props.volume);
    }, [props.volume]);

    return (
        <Wrapper>
            {props.analyser && <ChildWrapper><LevelMeter analyser={props.analyser} vertical={true}/></ChildWrapper>}
            <ChildWrapper>
                <VolumeSlider
                    min={0}
                    max={1}
                    step={0.05}
                    value={value}
                    color="rgba(255, 0, 255, 0.4)"
                    onChange={(volume) => setValue(volume)}
                    onEnd={(volume) => {
                        if (props.onVolumeChanged)
                            props.onVolumeChanged(volume)
                    }}
                />
            </ChildWrapper>
        </Wrapper>

    )
}

export default VerticalVolumeFader;