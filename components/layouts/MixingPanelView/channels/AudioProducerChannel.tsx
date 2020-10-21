import React from "react";
import useStageSelector from "../../../../lib/digitalstage/useStageSelector";
import {AudioProducer} from "../../../../lib/digitalstage/useStageContext/model";
import {useStageWebAudio} from "../../../../lib/useStageWebAudio";
import ChannelPanel from "./ChannelPanel";

const AudioProducerChannel = (props: {
    audioProducerId: string
}) => {
    const isAdmin: boolean = useStageSelector(state => state.stageId ? state.stages.byId[state.stageId].isAdmin : false);
    const audioProducer = useStageSelector<AudioProducer>(state => state.audioProducers.byId[props.audioProducerId]);

    const {byAudioProducer} = useStageWebAudio();

    return (
        <ChannelPanel
            analyser={byAudioProducer[props.audioProducerId] ? byAudioProducer[props.audioProducerId].analyserNode : undefined}
            name={audioProducer._id}
            volume={audioProducer.volume}
            isAdmin={isAdmin}
        />
    )
}
export default AudioProducerChannel;