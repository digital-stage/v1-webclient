import {styled} from "styletron-react";
import useStageSelector from "../../../lib/digitalstage/useStageSelector";
import React from "react";
import GroupChannel from "./channels/GroupChannel";

const Wrapper = styled("div", {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    overflowX: "scroll",
    overflowY: "hidden",
    whiteSpace: "nowrap",
});

/***
 * The mixing panel shows all available volume controls for an active stage
 * @constructor
 */
const MixingPanelView = () => {
    const groupIds = useStageSelector<string[]>(state => state.stageId ? state.groups.byStage[state.stageId] : []);

    return (
        <Wrapper>
            {groupIds.map(id => <GroupChannel key={id} groupId={id}/>)}
        </Wrapper>
    )
};
export default MixingPanelView;