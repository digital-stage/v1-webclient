import React from "react";
import useStageSelector, {useIsStageAdmin} from "../../../../lib/digitalstage/useStageSelector";
import {AudioProducer, CustomAudioProducer} from "../../../../lib/digitalstage/useStageContext/model";
import {useStageWebAudio} from "../../../../lib/useStageWebAudio";
import useStageActions from "../../../../lib/digitalstage/useStageActions";
import {styled} from "styletron-react";
import ChannelStrip from "../../../elements/audio/ChannelStrip";

const ColoredChannelPanel = styled(ChannelStrip, {
    backgroundColor: "rgba(100,100,130,1)"
})

const AudioProducerChannel = (props: {
    audioProducerId: string
}) => {
    const isAdmin: boolean = useIsStageAdmin();
    const audioProducer = useStageSelector<AudioProducer>(state => state.audioProducers.byId[props.audioProducerId]);
    const customAudioProducer = useStageSelector<CustomAudioProducer>(state => state.customAudioProducers.byAudioProducer[props.audioProducerId] ? state.customAudioProducers.byId[state.customAudioProducers.byAudioProducer[props.audioProducerId]] : undefined);

    const {byAudioProducer} = useStageWebAudio();

    const {updateStageMemberAudio, setCustomStageMemberAudio, removeCustomStageMemberAudio} = useStageActions();

    return (
        <ColoredChannelPanel
            analyser={byAudioProducer[props.audioProducerId] ? byAudioProducer[props.audioProducerId].analyserNode : undefined}
            name="Track"

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