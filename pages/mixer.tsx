import React from "react";
import {styled, useStyletron} from "styletron-react";
import MixingPanelView from "../components/layouts/MixingPanelView";
import useTheme from "@material-ui/core/styles/useTheme";

const Mixer = () => {
    const [css] = useStyletron();
    const theme = useTheme();

    return (
        <div className={css({
            position: "absolute",
            width: "100vw",
            height: "calc(100vh - 4rem)",
            top: "0",
            left: "0",
            overflowX: "scroll",
            overflowY: "hidden",
            display: "flex",
            alignItems: "center",
            marginTop: "4rem",
            [theme.breakpoints.up("md")]: {
                marginTop: 0,
                paddingLeft: "4rem"
            }
        })}>
            <div className={css({
                height: "100%",
                maxHeight: "600px"
            })}>
                <MixingPanelView/>
            </div>
        </div>
    )
}
export default Mixer;