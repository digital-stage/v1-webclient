import React from "react";
import {useStyletron} from "styletron-react";
import MixingPanelView from "../components/layouts/MixingPanelView";
import useTheme from "@material-ui/core/styles/useTheme";

const Mixer = () => {
    const [css] = useStyletron();
    const theme = useTheme();

    return (
        <div className={css({
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: "0",
            left: "0",
            overflowX: "scroll",
            overflowY: "auto",
            paddingTop: "2rem",
            [theme.breakpoints.up("md")]: {
                paddingTop: "0",
                paddingLeft: "4rem"
            }
        })}>
            <div className={css({
                height: "100%",
                maxHeight: "600px",
                minHeight: "400px"
            })}>
                <MixingPanelView/>
            </div>
        </div>
    )
}
export default Mixer;