import React from "react";
import useStageSelector, {useIsStageAdmin} from "../../../../lib/digitalstage/useStageSelector";
import {AudioProducer, CustomAudioProducer} from "../../../../lib/digitalstage/useStageContext/model";
import {useStageWebAudio} from "../../../../lib/useStageWebAudio";
import useStageActions from "../../../../lib/digitalstage/useStageActions";
import {styled} from "styletron-react";
import ChannelStrip from "../../../elements/audio/ChannelStrip";
import {Typography} from "@material-ui/core";

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
            addHeader={<Typography variant="h5">Track</Typography>}
            analyser={byAudioProducer[props.audioProducerId] ? byAudioProducer[props.audioProducerId].analyserNode : undefined}

            volume={audioProducer.volume}
            muted={audioProducer.muted}
            customVolume={customAudioProducer ? customAudioProducer.volume : undefined}
            customMuted={customAudioProducer ? customAudioProducer.muted : undefined}

            onVolumeChanged={(volume, muted) => updateStageMemberAudio(audioProducer._id, {
                volume: volume,
                muted: muted
            })}
            onCustomVolumeChanged={(volume, muted) => setCustomStageMemberAudio(audioProducer._id, {
                volume: volume,
                muted: muted
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