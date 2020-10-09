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
            right: "1rem",
            color: "white",
            "svg": {
                fill: "currentColor"
            }
        })}>
            <DeviceControl device={localDevice}/>
        </div>
    )
}
export default LocalDeviceControl;