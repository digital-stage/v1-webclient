import React, {useEffect, useState} from "react";
import LevelMeter from "./LevelMeter";
import {styled} from "baseui";
import {IAnalyserNode, IAudioContext} from "standardized-audio-context";
import VolumeSlider from "./VolumeSlider";
import {Input} from "@material-ui/core";
import {calculateDbMeasurement, Infinity} from "./util";

const Wrapper = styled("div", {
    position: "relative",
    width: "100px",
    height: "300px",
    display: 'flex',
    flexDirection: 'column',
});

const MainContainer = styled("div", {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center'
})
const FooterContainer = styled("div", {
    width: "100%",
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
})

const LevelContainer = styled("div", {
    width: "10px",
    height: "200px"
});

const SliderContainer = styled("div", {
    height: "200px"
});

const DbInputContainer = styled("div", {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
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
    const [value, setValue] = useState<number>(props.volume);
    const [dbMeasurement, setDbMeasurement] = useState<number | Infinity>();

    useEffect(() => {
        setValue(props.volume);
    }, [props.volume]);

    useEffect(() => {
        setDbMeasurement(calculateDbMeasurement(value));
    }, [value]);

    return (
        <Wrapper>
            <MainContainer>
                <SliderContainer>
                    <VolumeSlider
                        min={0}
                        max={1}
                        step={0.05}
                        color={props.sliderColor}
                        colorize={props.colorize}
                        value={value}
                        onChange={(volume) => setValue(volume)}
                        onEnd={(volume) => {
                            if (props.onVolumeChanged)
                                props.onVolumeChanged(volume)
                        }}
                    />
                </SliderContainer>
                {props.analyser && <LevelContainer><LevelMeter analyser={props.analyser}/></LevelContainer>}
            </MainContainer>
            <FooterContainer>
                <DbInputContainer>
                    <Input type="number" onChange={el => setValue(parseFloat(el.currentTarget.value))}
                           value={dbMeasurement}/> dB
                </DbInputContainer>
            </FooterContainer>
        </Wrapper>
    );
}
export default VolumeFader;