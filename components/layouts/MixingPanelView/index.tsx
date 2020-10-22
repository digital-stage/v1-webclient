import {styled} from "styletron-react";
import useStageSelector from "../../../lib/digitalstage/useStageSelector";
import React from "react";
import GroupChannel from "./channels/GroupChannel";

const Wrapper = styled("div", {
    width: "100%",
    height: "100%",
    maxHeight: "600px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    padding: ".2rem"
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