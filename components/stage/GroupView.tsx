import {Group} from "../../lib/digitalstage/useStageContext/model";
import {useStageState} from "../../lib/digitalstage/useStageContext";
import React from "react";
import StageMemberView from "./StageMemberView";


const GroupView = (props: {
    group: Group
}) => {
    const {stageMembers} = useStageState();

    return (
        <div>
            GROUP {props.group.name}
            {props.group.stageMembers.map(id => (
                <StageMemberView stageMember={stageMembers.byId[id]}/>
            ))}
        </div>
    );
};

export default GroupView;