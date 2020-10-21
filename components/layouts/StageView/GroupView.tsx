import {Group} from "../../../lib/digitalstage/useStageContext/model";
import React from "react";
import StageMemberView from "./StageMemberView";
import {useStyletron} from "baseui";
import {Cell, Grid} from "baseui/layout-grid";
import {NormalizedState, StageMembers} from "../../../lib/digitalstage/useStageContext/schema";
import {useSelector} from "../../../lib/digitalstage/useStageContext/redux";
import {Typography} from "@material-ui/core";


const GroupView = (props: {
    group: Group
}) => {
    const [css] = useStyletron();
    const stageMembers = useSelector<NormalizedState, StageMembers>(state => state.stageMembers);

    if (stageMembers.byGroup[props.group._id] && stageMembers.byGroup[props.group._id].length > 0) {
        return (
            <div className={css({})}>
                <Grid>
                    <Cell span={12}>
                        <Typography variant="h1">{props.group.name}</Typography>
                    </Cell>
                </Grid>
                <div className={css({
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                })}>
                    {stageMembers.byGroup[props.group._id].map(id => (
                        <StageMemberView key={id} stageMember={stageMembers.byId[id]}/>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default GroupView;