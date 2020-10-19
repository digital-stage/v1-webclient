import {AudioConsumer} from "../../../lib/digitalstage/useStageContext/model";
import React, {useEffect, useRef, useState} from "react";
import {IAudioContext, IGainNode} from "standardized-audio-context";
import {IAudioNode} from "standardized-audio-context/src/interfaces/audio-node";
import {useAudioContext} from "../../../lib/useAudioContext";
import useStageSelector from "../../../lib/digitalstage/useStageSelector";
import {StageMembers} from "../../../lib/digitalstage/useStageContext/schema";
import {styled} from "baseui";

const HiddenAudioPlayer = styled("audio", {
})

const AudioConsumerPlayer = (props: {
    destination: IAudioNode<IAudioContext>;
    audioConsumer: AudioConsumer;
}) => {
    const audioRef = useRef<HTMLAudioElement>();
    const {audioContext} = useAudioContext();
    const [gainNode, setGainNode] = useState<IGainNode<IAudioContext>>();
    const [actualVolume, setActualVolume] = useState<number>(0);

    const stageMembers = useStageSelector<StageMembers>(state => state.stageMembers);

    useEffect(() => {
        console.log("Stage member changed")
    }, [stageMembers.byId[props.audioConsumer._id]])

    useEffect(() => {
        if (audioContext && gainNode) {
            gainNode.gain.setValueAtTime(actualVolume, audioContext.currentTime);
        }
    }, [audioContext, gainNode, actualVolume]);

    useEffect(() => {
        if (audioContext && audioRef) {
            const source = audioContext.createMediaStreamTrackSource(props.audioConsumer.msConsumer.track);
            audioRef.current.srcObject = new MediaStream([props.audioConsumer.msConsumer.track]);

            const gainNode = audioContext.createGain();
            source.connect(gainNode);

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);  // Initial volume = 0
            setGainNode(gainNode);

            audioRef.current.play();
        }
    }, [audioContext, audioRef, props.destination, props.audioConsumer]);

    return (
        <>
            AUDIO PLAYER {props.audioConsumer._id}
            <HiddenAudioPlayer ref={audioRef}/>
        </>
    )
}
export default AudioConsumerPlayer;