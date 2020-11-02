import {GroupId} from "../../../../lib/digitalstage/common/model.server";
import React, {useState} from "react";
import useStageSelector, {useIsStageAdmin} from "../../../../lib/digitalstage/useStageSelector";
import {CustomGroup, Group} from "../../../../lib/digitalstage/useStageContext/model";
import useStageActions from "../../../../lib/digitalstage/useStageActions";
import StageMemberChannel from "./StageMemberChannel";
import {useStageWebAudio} from "../../../../lib/useStageWebAudio";
import {styled} from "styletron-react";
import ChannelStrip from "../../../elements/audio/ChannelStrip";
import {Typography} from "@material-ui/core";
import Button from "../../../../uikit/Button";
import {ChevronLeft, ChevronRight} from "baseui/icon";

const Panel = styled("div", {
    backgroundColor: "rgba(80,80,80,1)",
    display: "flex",
    flexDirection: "row",
    borderRadius: "20px",
    marginRight: "1rem"
})
const Column = styled("div", {
    paddingLeft: "1rem",
    paddingRight: "1rem",
    paddingTop: "3rem",
    paddingBottom: "3rem",
    height: "100%"
})
const Row = styled("div", {
    paddingTop: "1rem",
    paddingBottom: "1rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    display: "flex",
    flexDirection: "row",
    height: "100%"
})
const InnerRow = styled("div", {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "rgba(130,100,130,1)",
    borderRadius: "20px",
    height: "100%",
})
const ColumnWithChildren = styled("div", {
    height: "100%",
});
const Header = styled("div", {
    width: "100%",
    height: "64px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
})

const GroupChannel = (props: {
    groupId: GroupId;
    className?: string;
}) => {
    const isAdmin: boolean = useIsStageAdmin();
    const group = useStageSelector<Group>(state => state.groups.byId[props.groupId]);
    const customGroup = useStageSelector<CustomGroup>(state => state.customGroups.byGroup[props.groupId] ? state.customGroups.byId[state.customGroups.byGroup[props.groupId]] : undefined);
    const stageMemberIds = useStageSelector<string[]>(state => state.stageMembers.byGroup[props.groupId] ? state.stageMembers.byGroup[props.groupId] : []);

    const {updateGroup, setCustomGroup, removeCustomGroup} = useStageActions();
    const {byGroup} = useStageWebAudio();

    const [expanded, setExpanded] = useState<boolean>();

    return (
        <Panel className={props.className}>
            <Column>
                <ChannelStrip
                    addHeader={
                        <Header>
                            {stageMemberIds.length > 0 ? (
                                <Button
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}
                                    shape="pill"
                                    kind="minimal"
                                    endEnhancer={() => expanded ? <ChevronLeft/> : <ChevronRight/>}
                                    onClick={() => setExpanded(prev => !prev)}
                                >
                                    <Typography variant="h5">{group.name}</Typography>
                                </Button>
                            ) : (
                                <Typography variant="h5">{group.name}</Typography>
                            )}
                        </Header>
                    }

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
                />
            </Column>

            {expanded && (
                <Row>
                    <InnerRow>
                        {stageMemberIds.map(id => <ColumnWithChildren><StageMemberChannel key={id} stageMemberId={id}/></ColumnWithChildren>)}
                    </InnerRow>
                </Row>
            )}
        </Panel>
    )
}
export default GroupChannel;