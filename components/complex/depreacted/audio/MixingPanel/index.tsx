import {styled} from "styletron-react";
import useStageSelector from "../../../../../lib/digitalstage/useStageSelector";
import React, {useState} from "react";
import VerticalSlider from "../../theme/VerticalSlider";
import {Select, Value} from "baseui/select";
import GroupMixer from "./GroupMixer";

const Wrapper = styled("div", {
    width: "100%",
    height: "100%",
});
const Panel = styled("div", {
    width: "100%",
    height: "100%",
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
    const [global, setGlobal] = useState<boolean>(true);

    const isAdmin: boolean = useStageSelector(state => state.stageId ? state.stages.byId[state.stageId].isAdmin : false);
    const groupIds: string[] = useStageSelector<string[]>(state => state.stageId ? state.groups.byStage[state.stageId] : []);

    return (
        <Wrapper>
            {isAdmin ? (
                <>
                    <AdminSwitcher onSelected={value => setGlobal(value === "global")}/>
                    {groupIds && groupIds.map(id => <GroupMixer key={id} global={global} groupId={id}/>)}
                </>
            ) : (
                <Panel>
                    <VerticalSlider value={0.5} min={0} max={1} step={0.05} onEnd={(value) => console.log(value)}/>
                </Panel>

            )}


        </Wrapper>
    )
};
export default MixingPanel;