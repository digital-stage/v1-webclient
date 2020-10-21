import React from "react";
import GroupView from "./GroupView";
import {Groups} from "../../../lib/digitalstage/useStageContext/schema";
import useStageSelector from "../../../lib/digitalstage/useStageSelector";
import {Stage} from "../../../lib/digitalstage/common/model.server";

const StageView = (props: {
    stage: Stage
}) => {
    const groups = useStageSelector<Groups>(state => state.groups);

    return (
        <div>
            {groups.byStage[props.stage._id] && groups.byStage[props.stage._id].map(id => (
                <GroupView key={id} group={groups.byId[id]}/>
            ))}
        </div>
    )
};

export default StageView;