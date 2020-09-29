import React from "react";
import {useStyletron} from "baseui";
import DeviceControl from "./DeviceControl";
import {useDevices} from "../../../lib/digitalstage/useDevices";

const LocalDeviceControl = () => {
    const [css] = useStyletron();
    const {localDevice} = useDevices();

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