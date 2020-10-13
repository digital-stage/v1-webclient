import {Group} from "../../lib/digitalstage/useStageContext/model";
import {useStageState} from "../../lib/digitalstage/useStageContext";
import React from "react";
import StageMemberView from "./StageMemberView";
import {useStyletron} from "baseui";
import {Cell, Grid} from "baseui/layout-grid";
import {H1} from "../theme/typography/Headline";


const GroupView = (props: {
    group: Group
}) => {
    const [css] = useStyletron();
    const {stageMembers} = useStageState();

    if (stageMembers.byGroup[props.group._id] && stageMembers.byGroup[props.group._id].length > 0) {
        return (
            <div className={css({})}>
                <Grid>
                    <Cell span={12}>
                        <H1>{props.group.name}</H1>
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