import React, {useState} from "react";
import {Typography} from "@material-ui/core";
import {Button} from "baseui/button";
import VerticalSlider from "../../../theme/VerticalSlider";
import {styled} from "baseui";
import VolumeSlider from "../../../../../experimental/VolumeSlider";

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

    console.log(props);

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
                                <VolumeSlider
                                    value={props.volume}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    vertical={true}
                                    color="white"
                                    onEnd={(value) => {
                                        if (props.onVolumeChanged)
                                            props.onVolumeChanged(value);
                                    }}/>
                            </SinglePanelSlider>

                            {props.customVolume !== undefined && (
                                <SinglePanelSlider>
                                    <VolumeSlider
                                        value={props.volume}
                                        min={0}
                                        max={1}
                                        step={0.05}
                                        color="#FFF999"
                                        vertical={true}
                                        onEnd={(value) => {
                                            if (props.onCustomVolumeChanged)
                                                props.onCustomVolumeChanged(value);
                                        }}/>
                                </SinglePanelSlider>
                            )}
                        </>
                    ) : (
                        <VolumeSlider
                            value={props.customVolume || props.volume}
                            min={0}
                            max={1}
                            color={props.customVolume ? "#FFF99" : "white"}
                            step={0.05}
                            vertical={true}
                            onEnd={(value) => {
                                if (props.onCustomVolumeChanged)
                                    props.onCustomVolumeChanged(value);
                            }}/>
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