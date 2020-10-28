import React from "react";
import {useStyletron} from "baseui";
import DeviceControl from "./DeviceControl";
import useStageSelector from "../../../lib/digitalstage/useStageSelector";

const LocalDeviceControl = () => {
    const [css] = useStyletron();
    const {localDevice} = useStageSelector(state => ({localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined}));

    if (!localDevice)
        return null;

    return (
        <div className={css({
            position: "fixed",
            bottom: "1rem",
            left: "0",
            width: "100%"
        })}>
            <div className={css({
                display: "flex",
                width: "50vw",
                maxWidth: "160px",
                justifyContent: "space-between",
                alignItems: "space-between",
                color: "white",
                "svg": {
                    fill: "currentColor"
                },
                marginLeft: "auto",
                marginRight: "auto"
            })}>
                <DeviceControl device={localDevice}/>
            </div>
        </div>
    )
}
export default LocalDeviceControl;