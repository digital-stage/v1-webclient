import React, {useState} from "react";
import {Typography} from "@material-ui/core";
import {Button} from "baseui/button";
import {styled} from "baseui";
import {IAnalyserNode, IAudioContext} from "standardized-audio-context";
import VolumeFader from "../../../experimental/VolumeFader";

const Wrapper = styled("div", {
    position: "relative",
    width: 'auto',
    height: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    overflowX: "auto"
});

const SinglePanel = styled("div", (props: { $backgroundColor }) => ({
    display: "flex",
    flexDirection: "column",
    width: "260px",
    height: "100%",
    padding: "1rem",
    backgroundColor: props.$backgroundColor
}));

const SinglePanelTitle = styled("div", {
    flexGrow: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
})

const SinglePanelSliderRow = styled("div", {
    flexGrow: 1,
    width: '100%',
    height: "100%",
    padding: "2rem",
    display: 'flex',
    flexDirection: "row",
})

const SinglePanelSlider = styled("div", {
    display: 'block',
    width: '100%',
    height: "100%",
})

const SinglePanelAction = styled("div", {
    flexGrow: 0,
    width: '100%',
    padding: "2rem",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
})

const ChannelPanel = (props: {
    analyser?: IAnalyserNode<IAudioContext>;

    name: string;
    volume: number;
    customVolume?: number;
    onVolumeChanged?: (volume: number) => void;
    onCustomVolumeChanged?: (volume: number) => void;
    onCustomVolumeReset?: () => void;
    isAdmin?: boolean;

    backgroundColor?: string;

    children?: React.ReactNode;
}) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <Wrapper>
            <SinglePanel
                $backgroundColor={props.backgroundColor}
            >
                <SinglePanelTitle>
                    <Typography variant="h4">{props.name}</Typography>
                    {props.children && React.Children.count(props.children) > 0 && (
                        <Button size="mini" onClick={() => setExpanded(prev => !prev)}>
                            {expanded ? "<<" : ">>"}
                        </Button>
                    )}

                </SinglePanelTitle>

                <SinglePanelSliderRow>
                    {props.isAdmin ? (
                        <>
                            <SinglePanelSlider>
                                <VolumeFader
                                    volume={props.volume}
                                    analyser={props.analyser}
                                    sliderColor="white"
                                    onVolumeChanged={(value) => {
                                        if (props.onVolumeChanged)
                                            props.onVolumeChanged(value);
                                    }}
                                />
                            </SinglePanelSlider>

                            {props.customVolume !== undefined && (
                                <SinglePanelSlider>
                                    <VolumeFader
                                        volume={props.volume}
                                        analyser={props.analyser}
                                        sliderColor="#FFF999"
                                        onVolumeChanged={(value) => {
                                            if (props.onCustomVolumeChanged)
                                                props.onCustomVolumeChanged(value);
                                        }}
                                    />
                                </SinglePanelSlider>
                            )}
                        </>
                    ) : (
                        <VolumeFader
                            volume={props.customVolume || props.volume}
                            analyser={props.analyser}
                            sliderColor={props.customVolume ? "#FFF99" : "white"}
                            onVolumeChanged={(value) => {
                                if (props.onCustomVolumeChanged)
                                    props.onCustomVolumeChanged(value);
                            }}
                        />
                    )}
                </SinglePanelSliderRow>
                <SinglePanelAction>
                    {(props.customVolume !== undefined) && (
                        <Button onClick={() => {
                            if (props.onCustomVolumeReset)
                                props.onCustomVolumeReset();
                        }}>Reset</Button>
                    )}
                    {(props.customVolume === undefined && props.isAdmin) ? (
                        <Button onClick={() => {
                            if (props.onCustomVolumeChanged)
                                props.onCustomVolumeChanged(1);
                        }}>Custom</Button>
                    ) : null}
                </SinglePanelAction>
            </SinglePanel>

            {expanded && props.children}
        </Wrapper>
    )
}
export default ChannelPanel;