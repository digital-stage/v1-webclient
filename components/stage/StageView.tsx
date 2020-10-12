import {useStageState} from "../../lib/digitalstage/useStageContext";
import React, {useEffect, useState} from "react";
import GroupView from "./GroupView";
import {Group, Stage} from "../../lib/digitalstage/useStageContext/model";

const StageView = (props: {
    stage: Stage
}) => {
    const {groups: allGroups} = useStageState();
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        if (props.stage) {
            setGroups(props.stage.groups.map(id => allGroups.byId[id]));
        } else {
            setGroups([]);
        }
    }, [props.stage, allGroups])

    return (
        <div>
            {groups.map(group => (
                <GroupView group={group}/>
            ))}
        </div>
    )
};

export default StageView;