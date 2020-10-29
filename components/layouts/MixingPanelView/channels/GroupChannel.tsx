import {GroupId} from "../../../../lib/digitalstage/common/model.server";
import React from "react";
import useStageSelector, {useIsStageAdmin} from "../../../../lib/digitalstage/useStageSelector";
import {CustomGroup, Group} from "../../../../lib/digitalstage/useStageContext/model";
import useStageActions from "../../../../lib/digitalstage/useStageActions";
import StageMemberChannel from "./StageMemberChannel";
import {useStageWebAudio} from "../../../../lib/useStageWebAudio";
import {styled} from "styletron-react";
import ChannelStrip from "../../../elements/audio/ChannelStrip";
import {Typography} from "@material-ui/core";

const ColoredChannelPanel = styled(ChannelStrip, {
    backgroundColor: "rgba(80,80,80,1)",
    borderRadius: "20px",
    marginRight: ".5rem",
    marginLeft: ".5rem"
})

const GroupChannel = (props: {
    groupId: GroupId
}) => {
    const isAdmin: boolean = useIsStageAdmin();
    const group = useStageSelector<Group>(state => state.groups.byId[props.groupId]);
    const customGroup = useStageSelector<CustomGroup>(state => state.customGroups.byGroup[props.groupId] ? state.customGroups.byId[state.customGroups.byGroup[props.groupId]] : undefined);
    const stageMemberIds = useStageSelector<string[]>(state => state.stageMembers.byGroup[props.groupId] ? state.stageMembers.byGroup[props.groupId] : []);

    const {updateGroup, setCustomGroup, removeCustomGroup} = useStageActions();
    const {byGroup} = useStageWebAudio();

    return (
        <ColoredChannelPanel
            addHeader={<Typography variant="h5">group.name</Typography>}

            analyser={byGroup[props.groupId] ? byGroup[props.groupId].analyserNode : undefined}

            volume={group.volume}
            muted={group.muted}
            customVolume={customGroup ? customGroup.volume : undefined}
            customMuted={customGroup ? customGroup.muted : undefined}

            onVolumeChanged={isAdmin ? (volume, muted) => updateGroup(group._id, {
                volume: volume,
                muted: muted
            }) : undefined}
            onCustomVolumeChanged={(volume, muted) => setCustomGroup(group._id, volume, muted)}
            onCustomVolumeReset={() => {
                if (removeCustomGroup)
                    return removeCustomGroup(customGroup._id)
            }}
            isAdmin={isAdmin}
        >
            {stageMemberIds.map(id => <StageMemberChannel key={id} stageMemberId={id}/>)}
        </ColoredChannelPanel>
    )
}
export default GroupChannel;