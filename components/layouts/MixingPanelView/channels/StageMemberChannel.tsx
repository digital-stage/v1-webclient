import React from "react";
import useStageSelector, {useIsStageAdmin} from "../../../../lib/digitalstage/useStageSelector";
import {CustomStageMember, StageMember, User} from "../../../../lib/digitalstage/common/model.server";
import ChannelStrip from "../../../elements/audio/ChannelStrip";
import useStageActions from "../../../../lib/digitalstage/useStageActions";
import AudioProducerChannel from "./AudioProducerChannel";
import {useStageWebAudio} from "../../../../lib/useStageWebAudio";
import {styled} from "styletron-react";
import {Typography} from "@material-ui/core";

const ColoredChannelPanel = styled(ChannelStrip, {
    backgroundColor: "rgba(130,100,130,1)"
})

const StageMemberChannel = (props: {
    stageMemberId: string
}) => {
    const isAdmin: boolean = useIsStageAdmin();
    const stageMember = useStageSelector<StageMember>(state => state.stageMembers.byId[props.stageMemberId]);
    const customStageMember = useStageSelector<CustomStageMember>(state => state.customStageMembers.byStageMember[props.stageMemberId] ? state.customStageMembers.byId[state.customStageMembers.byStageMember[props.stageMemberId]] : undefined);
    const user = useStageSelector<User>(state => state.users.byId[stageMember.userId]);
    const audioProducers = useStageSelector<string[]>(state => state.audioProducers.byStageMember[props.stageMemberId]);

    const {byStageMember} = useStageWebAudio();

    const {updateStageMember, setCustomStageMember, removeCustomStageMember} = useStageActions();

    return (
        <ColoredChannelPanel
            addHeader={<Typography variant="h5">{user.name}</Typography>}

            volume={stageMember.volume}
            muted={stageMember.muted}
            customVolume={customStageMember ? customStageMember.volume : undefined}
            customMuted={customStageMember ? customStageMember.muted : undefined}

            analyser={byStageMember[props.stageMemberId] ? byStageMember[props.stageMemberId].analyserNode : undefined}

            onVolumeChanged={(volume, muted) => updateStageMember(stageMember._id, {
                volume: volume,
                muted: muted
            })}
            onCustomVolumeChanged={(volume, muted) => setCustomStageMember(stageMember._id, {
                volume: volume,
                muted: muted
            })}
            onCustomVolumeReset={() => {
                if (customStageMember)
                    return removeCustomStageMember(customStageMember._id)
            }}
            isAdmin={isAdmin}
        >
            {audioProducers && audioProducers.map(id => <AudioProducerChannel key={id} audioProducerId={id}/>)}
        </ColoredChannelPanel>
    )
}
export default StageMemberChannel;