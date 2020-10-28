import React, {useState} from "react";
import {Typography} from "@material-ui/core";
import {Button} from "baseui/button";
import {styled} from "baseui";
import {IAnalyserNode, IAudioContext} from "standardized-audio-context";
import VolumeFader from "./VolumeFader";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const Wrapper = styled("div", {
    position: "relative",
    flexShrink: 0,
    width: 'auto',
    height: "100%",
    display: "flex",
    flexDirection: "row",
    overflowX: "auto"
});

const SinglePanel = styled("div", {
    display: "flex",
    flexDirection: "column",
    width: "160px",
    height: "100%",
    padding: "1rem"
});

const SinglePanelHeader = styled("div", {
    flexGrow: 0,
    height: "80px",
});

const SinglePanelHeaderAction = styled("div", {
    display: 'flex',
    width: "100%",
    flexDirection: "column",
    cursor: "pointer",
    alignItems: 'center'
})

const SinglePanelSliderRow = styled("div", {
    flexGrow: 1,
    display: 'flex',
    width: '100%',
    padding: "2rem",
    flexDirection: "row"
})

const SinglePanelAction = styled("div", {
    flexGrow: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
})

const ChildPanel = styled("div", {
    padding: "1rem",
    height: "100%",
})
const InnerChildPanel = styled("div", {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    borderRadius: "20px",
    overflow: "hidden"
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

    className?: string;
}) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    console.log("[CHANNEL PANEL] volume: " + props.volume);
    console.log("[CHANNEL PANEL] customVolume: " + props.customVolume);

    return (
        <Wrapper className={props.className}>
            <SinglePanel>
                <SinglePanelHeader>
                    {React.Children.count(props.children) > 0 ? (
                        <SinglePanelHeaderAction onClick={() => {
                            setExpanded(prev => !prev)
                        }}>
                            <Typography variant="h5">{props.name}</Typography>
                            <IconButton color="inherit">
                                {expanded ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                            </IconButton>
                        </SinglePanelHeaderAction>
                    ) : (
                        <Typography variant="h5">{props.name}</Typography>
                    )}
                </SinglePanelHeader>

                <SinglePanelSliderRow>
                    <VolumeFader
                        volume={props.isAdmin ? props.volume : (props.customVolume || props.volume)}
                        analyser={props.analyser}
                        color={props.customVolume ? [255, 0, 0] : [255, 255, 255]}
                        onVolumeChanged={(value) => {
                            console.log("[CHANNEL PANEL] Changed " + (!props.isAdmin ? "custom volume" : "global volume") + " to " + value);
                            if (props.isAdmin) {
                                if (props.onVolumeChanged)
                                    props.onVolumeChanged(value);
                            } else {
                                if (props.onCustomVolumeChanged)
                                    props.onCustomVolumeChanged(value);
                            }
                        }}
                    />
                    {props.isAdmin && (
                        <VolumeFader
                            volume={props.customVolume || 0}
                            color={props.customVolume ? [255, 0, 0] : [255, 255, 255]}
                            onVolumeChanged={(value) => {
                                if (props.onCustomVolumeChanged)
                                    props.onCustomVolumeChanged(value);
                            }}
                        />
                    )}
                </SinglePanelSliderRow>
                <SinglePanelAction>
                    {props.customVolume && (
                        <Button onClick={() => {
                            if (props.onCustomVolumeReset)
                                props.onCustomVolumeReset();
                        }}>Reset</Button>
                    )}
                </SinglePanelAction>
            </SinglePanel>

            {expanded && (
                <ChildPanel>
                    <InnerChildPanel>
                        {props.children}
                    </InnerChildPanel>
                </ChildPanel>
            )}
        </Wrapper>
    )
}
export default ChannelPanel;