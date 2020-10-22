import React from "react";
import useStageSelector from "../../../../lib/digitalstage/useStageSelector";
import {AudioProducer, CustomAudioProducer} from "../../../../lib/digitalstage/useStageContext/model";
import {useStageWebAudio} from "../../../../lib/useStageWebAudio";
import ChannelPanel from "../../../experimental/ChannelPanel";
import useStageActions from "../../../../lib/digitalstage/useStageActions";

const AudioProducerChannel = (props: {
    audioProducerId: string
}) => {
    const isAdmin: boolean = useStageSelector(state => state.stageId ? state.stages.byId[state.stageId].isAdmin : false);
    const audioProducer = useStageSelector<AudioProducer>(state => state.audioProducers.byId[props.audioProducerId]);
    const customAudioProducer = useStageSelector<CustomAudioProducer>(state => state.customAudioProducers.byAudioProducer[props.audioProducerId] ? state.customAudioProducers.byId[state.customAudioProducers.byAudioProducer[props.audioProducerId]] : undefined);

    const {byAudioProducer} = useStageWebAudio();

    const {updateStageMemberAudio, setCustomStageMemberAudio, removeCustomStageMemberAudio} = useStageActions();

    return (
        <ChannelPanel
            analyser={byAudioProducer[props.audioProducerId] ? byAudioProducer[props.audioProducerId].analyserNode : undefined}
            name={audioProducer._id}
            volume={audioProducer.volume}
            customVolume={customAudioProducer ? customAudioProducer.volume : undefined}
            onVolumeChanged={volume => updateStageMemberAudio(audioProducer._id, {
                volume: volume
            })}
            onCustomVolumeChanged={volume => setCustomStageMemberAudio(audioProducer._id, {
                volume: volume
            })}
            onCustomVolumeReset={() => {
                if (customAudioProducer)
                    return removeCustomStageMemberAudio(customAudioProducer._id)
            }}
            isAdmin={isAdmin}
        />
    )
}
export default AudioProducerChannel;