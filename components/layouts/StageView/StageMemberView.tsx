import {useStyletron} from "baseui";
import React, {useEffect, useRef, useState} from "react";
import {Avatar} from "baseui/avatar";
import OnlineStatus from "../../complex/depreacted/theme/OnlineStatus";
import CanvasPlayer from "../../experimental/CanvasPlayer";
import {Typography} from "@material-ui/core";
import useStageSelector, {ExtendedStageMember, useIsStageAdmin} from "../../../lib/digitalstage/useStageSelector";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import useStageActions from "../../../lib/digitalstage/useStageActions";
import {styled} from "styletron-react";
import {AudioProducer, CustomAudioProducer} from "../../../lib/digitalstage/useStageContext/model";
import useHover from "../../../lib/useHover";
import VolumeSlider from "../../experimental/VolumeSlider";
import VerticalVolumeFader from "../../experimental/VerticalVolumeFader";
import {useStageWebAudio} from "../../../lib/useStageWebAudio";
import {IAnalyserNode, IAudioContext} from "standardized-audio-context";

const StageMemberTitle = (props: {
    stageMember: ExtendedStageMember
}) => {
    const [css] = useStyletron();
    const {updateStageMember} = useStageActions();
    const isAdmin = useIsStageAdmin();

    return (
        <>
            <div className={css({
                display: 'flex',
                width: 'calc(100% - 2rem)',
                alignItems: 'center'
            })}>
                <div className={css({
                    margin: '.5rem',
                    flexGrow: 0
                })}>
                    <Avatar name={props.stageMember.name}/>
                </div>
                <div className={css({
                    display: 'flex',
                    flexGrow: 1
                })}>
                    <Typography variant="h5">{props.stageMember.name}</Typography>
                </div>

                {isAdmin && (
                    <div className={css({
                        display: 'flex',
                        flexGrow: 0,
                        cursor: "pointer"
                    })}
                         onClick={() => updateStageMember(props.stageMember._id, {
                             isDirector: !props.stageMember.isDirector
                         })}>
                        {props.stageMember.isDirector ? <StarIcon/> : <StarBorderIcon/>}
                    </div>
                )}
                <OnlineStatus overrides={{
                    display: 'flex',
                    flexGrow: 0
                }} online={props.stageMember.online}/>
            </div>
        </>
    )
}

const VolumePanel = styled("div", {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column"
});

const StageMemberVolumeControl = (props: {
    stageMember: ExtendedStageMember;
}) => {
    const audioProducers = useStageSelector<AudioProducer[]>(state => state.audioProducers.byStageMember[props.stageMember._id] ? state.audioProducers.byStageMember[props.stageMember._id].map(id => state.audioProducers.byId[id]) : []);
    const panelRef = useRef<HTMLDivElement>();
    const hover = useHover<HTMLDivElement>(panelRef);
    const stageWebAudio = useStageWebAudio();

    const [analyser, setAnalyser] = useState<IAnalyserNode<IAudioContext>>();

    useEffect(() => {
        if (stageWebAudio) {
            const analyser = stageWebAudio.byStageMember[props.stageMember._id] && stageWebAudio.byStageMember[props.stageMember._id].analyserNode;
            if (analyser)
                console.log("HAVE ANALYSER")
            setAnalyser(analyser)
        }

    }, [stageWebAudio, props.stageMember])


    return (
        <VolumePanel
            ref={panelRef}
        >
            {hover && audioProducers.map(audioProducer => (
                <div>
                    AUDIO PRODUCER
                </div>
            ))}
            <VerticalVolumeFader
                volume={props.stageMember.volume}
                analyser={analyser}
            />
            <div>MAIN VOLUME CONTROL</div>
        </VolumePanel>
    );
}

const StageMemberView = (props: {
    stageMember: ExtendedStageMember
}) => {
    const [css] = useStyletron();

    return (
        <div className={css({
            position: "relative",
            display: 'flex',
            width: '50vw',
            backgroundImage: 'url("/images/white_logo.png")',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "20%",
            "@media screen and (min-width: 800px)": {
                width: '25vw',
            },
        })}>
            <div className={css({
                paddingTop: '100%'
            })}/>
            {props.stageMember.videoConsumers.length > 0 &&
            <CanvasPlayer className={css({
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            })} consumers={props.stageMember.videoConsumers}/>
            }
            <div className={css({
                position: "absolute",
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            })}>
                <StageMemberTitle stageMember={props.stageMember}/>
            </div>
            <StageMemberVolumeControl stageMember={props.stageMember}/>
        </div>
    )
}
export default StageMemberView;