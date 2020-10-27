import React from "react";
import GroupView from "./GroupView";
import { useGroupsByStage} from "../../../lib/digitalstage/useStageSelector";
import {Stage} from "../../../lib/digitalstage/useStageContext/model";
import ConductorsView from "./ConductorsView";

const StageView = (props: {
    stage: Stage
}) => {
    const groups = useGroupsByStage(props.stage._id);

    return (
        <div>
            {groups.map(group => (
                <GroupView key={group._id} group={group}/>
            ))}
            <ConductorsView />
        </div>
    )
};

export default StageView;