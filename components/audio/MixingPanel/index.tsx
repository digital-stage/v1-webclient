import {styled} from "styletron-react";
import useStageSelector from "../../../lib/digitalstage/useStageSelector";
import React, {useState} from "react";
import VerticalSlider from "../../theme/VerticalSlider";
import {Select} from "baseui/select";

const Wrapper = styled("div", {
    width: "100%",
    height: "100%",
});
const Panel = styled("div", {
    width: "100%",
    height: "100%",
});

const adminOptions = [{label: "Global"}, {label: "Benutzerdefiniert"}]
const AdminSwitcher = (
    props: {
        onSelected: (mode: "global" | "monitor") => any
    }
) => {
    const [value, setValue] = React.useState([]);

    return (
        <Select
            options={[
                {label: "AliceBlue", id: "global"},
                {label: "AntiqueWhite", id: "monitor"},
            ]}
            value={[{label: "Monitor"}]}
            onChange={(params) => setValue(params.option)}
        />
    )
};

const MixingPanel = () => {
    const [global, setGlobal] = useState<boolean>(true);

    const stageId = useStageSelector<string>(state => state.stageId);
    const isAdmin: boolean = useStageSelector(state => state.stageId ? state.stages.byId[state.stageId].isAdmin : false);

    return (
        <Wrapper>
            {isAdmin ? (
                <div>
                    <AdminSwitcher onSelected={useGlobal => setGlobal(useGlobal)}/>


                    <VerticalSlider value={0.5} min={0} max={1} step={0.05} onEnd={(value) => console.log(value)}/>

                </div>
            ) : (
                <Panel>
                    <VerticalSlider value={0.5} min={0} max={1} step={0.05} onEnd={(value) => console.log(value)}/>
                </Panel>

            )}


        </Wrapper>
    )
};
export default MixingPanel;