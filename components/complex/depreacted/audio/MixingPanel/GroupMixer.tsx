import useStageSelector from "../../../../../lib/digitalstage/useStageSelector";
import {Group, StageMember} from "../../../../../lib/digitalstage/useStageContext/model";
import {styled} from "baseui";
import React, {useState} from "react";
import {Button} from "baseui/button";
import VerticalSlider from "../../theme/VerticalSlider";
import {Typography} from "@material-ui/core";
import {Users} from "../../../../../lib/digitalstage/useStageContext/schema";
import useStageActions from "../../../../../lib/digitalstage/useStageActions";

const Wrapper = styled("div", {
    height: "100%",
    border: "1px solid red",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
})

const SinglePanel = styled("div", {
    display: "flex",
    flexDirection: "column",
    border: "1px solid blue",
    width: "300px",
    height: "100%",
    padding: "1rem"
});

const SinglePanelTitle = styled("div", {
    flexGrow: 0,
    display: 'flex',
    alignItems: 'center'
})

const SinglePanelSlider = styled("div", {
    flexGrow: 1,
    width: '100%',
    padding: "2rem"
})


const GroupMixer = (
    props: {
        groupId: string,
        global: boolean
    }
) => {
    const {updateGroup, updateCustomStageMember, updateStageMember,updateCustomGroup} = useStageActions();
    const group = useStageSelector<Group>(state => state.groups.byId[props.groupId]);
    const users = useStageSelector<Users>(state => state.users);
    const stageMembers = useStageSelector<StageMember[]>(state => state.stageMembers.byGroup[props.groupId] ? state.stageMembers.byGroup[props.groupId].map(id => state.stageMembers.byId[id]) : []);
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <Wrapper>
            <SinglePanel>
                <SinglePanelTitle>
                    <Typography variant="h4">Gruppe {group.name}</Typography>
                    <Button size="mini" onClick={() => setExpanded(prev => !prev)}>
                        {expanded ? "<<" : ">>"}
                    </Button>
                </SinglePanelTitle>

                <SinglePanelSlider>
                    <VerticalSlider
                        value={group.volume}
                        min={0}
                        max={1}
                        step={0.05}
                        onEnd={(value) => props.global ? updateGroup(group._id, {
                            volume: value
                        }) : updateCustomGroup(group._id, value)}/>
                </SinglePanelSlider>

            </SinglePanel>

            {expanded && stageMembers && (
                <>
                    {stageMembers.map(stageMember => (
                        <SinglePanel>
                            <SinglePanelTitle>
                                <Typography
                                    variant="h5">{users.byId[stageMember.userId] && users.byId[stageMember.userId].name}</Typography>
                            </SinglePanelTitle>

                            <SinglePanelSlider>
                                <VerticalSlider
                                    value={stageMember.volume}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    onEnd={(value) => props.global ? updateStageMember(stageMember._id, {
                                        volume: value
                                    }) : updateCustomStageMember(stageMember._id, {
                                        volume: value
                                    })}/>
                            </SinglePanelSlider>
                        </SinglePanel>

                    ))}
                </>
            )}

        </Wrapper>
    )
}
export default GroupMixer;