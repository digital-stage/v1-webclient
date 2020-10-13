import {useStageState} from "../../lib/digitalstage/useStageContext";
import React from "react";
import GroupView from "./GroupView";
import {Stage} from "../../lib/digitalstage/useStageContext/model";

const StageView = (props: {
    stage: Stage
}) => {
    const {groups} = useStageState();

    return (
        <div>
            {groups.byStage[props.stage._id] && groups.byStage[props.stage._id].map(id => (
                <GroupView key={id} group={groups.byId[id]}/>
            ))}
        </div>
    )
};

export default StageView;