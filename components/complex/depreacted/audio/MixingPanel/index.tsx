import {styled} from "styletron-react";
import useStageSelector from "../../../../../lib/digitalstage/useStageSelector";
import React from "react";
import {Select, Value} from "baseui/select";
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

const adminOptions = [
    {label: "Global", id: "global"},
    {label: "Monitor", id: "monitor"}
];
const AdminSwitcher = (
    props: {
        onSelected: (mode: "global" | "monitor") => any
    }
) => {
    const [value, setValue] = React.useState<Value>([
        adminOptions[0]
    ]);

    return (
        <Select
            clearable={false}
            options={adminOptions}
            value={value}
            onChange={params => {
                setValue(params.value);
                if (props.onSelected)
                    params.option.id === "global" ? props.onSelected("global") : props.onSelected("monitor")
            }}
        />
    )
};

const MixingPanel = () => {
    const groupIds = useStageSelector<string[]>(state => state.stageId ? state.groups.byStage[state.stageId] : []);

    return (
        <Wrapper>
            {groupIds.map(id => <GroupChannel key={id} groupId={id}/>)}
        </Wrapper>
    )
};
export default MixingPanel;