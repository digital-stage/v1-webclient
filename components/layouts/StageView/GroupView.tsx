import {Group} from "../../../lib/digitalstage/useStageContext/model";
import React from "react";
import StageMemberView from "./StageMemberView";
import {useStyletron} from "baseui";
import {Cell, Grid} from "baseui/layout-grid";
import {Typography} from "@material-ui/core";
import {useStageMembersByGroup} from "../../../lib/digitalstage/useStageSelector";


const GroupView = (props: {
    group: Group
}) => {
    const [css] = useStyletron();
    const stageMembers = useStageMembersByGroup(props.group._id);

    if (stageMembers.length > 0) {
        return (
            <div className={css({})}>
                <Grid>
                    <Cell span={12}>
                        <Typography variant="h3">{props.group.name}</Typography>
                    </Cell>
                </Grid>
                <div className={css({
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start'
                })}>
                    {stageMembers.map(stageMember => (
                        <StageMemberView key={stageMember._id} stageMember={stageMember}/>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default GroupView;