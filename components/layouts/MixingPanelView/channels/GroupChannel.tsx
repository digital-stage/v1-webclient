import {GroupId} from "../../../../lib/digitalstage/common/model.server";
import React from "react";
import useStageSelector from "../../../../lib/digitalstage/useStageSelector";
import {CustomGroup, Group} from "../../../../lib/digitalstage/useStageContext/model";
import useStageActions from "../../../../lib/digitalstage/useStageActions";
import ChannelPanel from "../../../experimental/ChannelPanel";
import StageMemberChannel from "./StageMemberChannel";
import {useStageWebAudio} from "../../../../lib/useStageWebAudio";

const GroupChannel = (props: {
    groupId: GroupId
}) => {
    const isAdmin: boolean = useStageSelector(state => state.stageId ? state.stages.byId[state.stageId].isAdmin : false);
    const group = useStageSelector<Group>(state => state.groups.byId[props.groupId]);
    const customGroup = useStageSelector<CustomGroup>(state => state.customGroups.byGroup[props.groupId] ? state.customGroups.byId[state.customGroups.byGroup[props.groupId]] : undefined);

    const {updateGroup, removeCustomGroup, setCustomGroup} = useStageActions();
    const stageMemberIds = useStageSelector<string[]>(state => state.stageMembers.byGroup[props.groupId] ? state.stageMembers.byGroup[props.groupId] : []);

    const {byGroup} = useStageWebAudio();

    return (
            <ChannelPanel
                analyser={byGroup[props.groupId] ? byGroup[props.groupId].analyserNode : undefined}
                name={group.name}
                volume={group.volume}
                customVolume={customGroup ? customGroup.volume : undefined}
                onVolumeChanged={volume => updateGroup(group._id, {
                    volume: volume
                })}
                onCustomVolumeChanged={volume => setCustomGroup(group._id, volume)}
                onCustomVolumeReset={() => removeCustomGroup(customGroup._id)}
                isAdmin={isAdmin}
            >
                {stageMemberIds.map(id => <StageMemberChannel key={id} stageMemberId={id}/>)}
            </ChannelPanel>
    )
}
export default GroupChannel;