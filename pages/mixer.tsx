import React from "react";
import { styled } from "styletron-react";
import MixingPanelView from "../components/layouts/MixingPanelView";

const Wrapper = styled("div", {
  position: "relative",
  border: "1px solid red",
  overflowX: "scroll",
  overflowY: "auto",
  whiteSpace: "nowrap",

  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  height: "100%",
});

const Mixer = () => {
  return (
    <Wrapper>
      <MixingPanelView />
    </Wrapper>
  );
};
export default Mixer;
