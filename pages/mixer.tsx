import React from "react";
import VerticalSlider from "../components/complex/depreacted/theme/VerticalSlider";
import {styled} from "styletron-react";
import MixingPanel from "../components/complex/depreacted/audio/MixingPanel";

const Wrapper = styled("div", {
    position: "absolute",
    width: "100vw",
    height: "calc(100vh - 72px)",
    border: "1px solid red",
    top: "72px",
    left: "0",
    overflowX: "hidden",
    overflowY: "scroll",
    padding: "2rem"
});

const Mixer = () => {
    return (
        <Wrapper>
            <MixingPanel/>
        </Wrapper>
    )
}
export default Mixer;