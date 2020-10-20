import React from "react";
import useStageSelector from "../../../../../../lib/digitalstage/useStageSelector";
import {CustomStageMember, StageMember, User} from "../../../../../../lib/digitalstage/common/model.server";
import ChannelPanel from "./ChannelPanel";
import useStageActions from "../../../../../../lib/digitalstage/useStageActions";

const StageMemberChannel = (props: {
    stageMemberId: string
}) => {
    const {updateStageMember, setCustomStageMember} = useStageActions();
    const isAdmin: boolean = useStageSelector(state => state.stageId ? state.stages.byId[state.stageId].isAdmin : false);
    const stageMember = useStageSelector<StageMember>(state => state.stageMembers.byId[props.stageMemberId]);
    const customStageMember = useStageSelector<CustomStageMember>(state => state.customStageMembers.byStageMember[props.stageMemberId] ? state.customStageMembers.byId[state.customStageMembers.byStageMember[props.stageMemberId]] : undefined);
    const user = useStageSelector<User>(state => state.users.byId[stageMember.userId]);

    return (
        <ChannelPanel
            name={user.name}
            volume={stageMember.volume}
            customVolume={customStageMember ? customStageMember.volume : undefined}
            backgroundColor="#333333"
            onVolumeChanged={volume => updateStageMember(stageMember._id, {
                volume: volume
            })}
            onCustomVolumeChanged={volume => setCustomStageMember(stageMember._id, {
                volume: volume
            })}
            isAdmin={isAdmin}
        >
        </ChannelPanel>
    )
}
export default StageMemberChannel;