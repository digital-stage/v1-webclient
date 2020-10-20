import React from "react";
import GroupView from "./GroupView";
import {Stage} from "../../../../lib/digitalstage/useStageContext/model";
import {useSelector} from "../../../../lib/digitalstage/useStageContext/redux";
import {Groups, NormalizedState, VideoConsumers} from "../../../../lib/digitalstage/useStageContext/schema";
import {shallowEqual} from "react-redux";

const StageView = (props: {
    stage: Stage
}) => {
    const groups = useSelector<NormalizedState, Groups>(state => state.groups, shallowEqual);

    return (
        <div>
            {groups.byStage[props.stage._id] && groups.byStage[props.stage._id].map(id => (
                <GroupView key={id} group={groups.byId[id]}/>
            ))}
        </div>
    )
};

export default StageView;