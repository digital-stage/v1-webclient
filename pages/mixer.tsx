import React from "react";
import {styled} from "styletron-react";
import MixingPanelView from "../components/layouts/MixingPanelView";

const Wrapper = styled("div", {
    position: "absolute",
    width: "100vw",
    height: "calc(100vh - 72px)",
    top: "72px",
    left: "0",
    overflowX: "scroll",
    overflowY: "hidden",
    padding: "2rem"
});

const Mixer = () => {
    return (
        <Wrapper>
            <MixingPanelView/>
        </Wrapper>
    )
}
export default Mixer;