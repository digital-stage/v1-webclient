import {useDevice} from "../lib/useDevice";
import DeviceView from "../components/DeviceView";
import {HeadingLarge} from "baseui/typography/index";
import StageListView from "../components/StageListView";
import React from "react";
import LocalDeviceSettings from "../components/LocalDeviceSettings";

const Index = () => {
    const {localDevice, remoteDevices} = useDevice();

    return (
        <>
            <LocalDeviceSettings/>
            <>
                <HeadingLarge>Stages</HeadingLarge>
                <StageListView/>
            </>
            <>
                <HeadingLarge>Devices</HeadingLarge>
            </>
            {localDevice && <DeviceView device={localDevice}/>}
            {remoteDevices && (
                <>
                    <h2>Remote Devices</h2>
                    {remoteDevices.map(remoteDevices => <DeviceView device={remoteDevices}/>)}
                </>
            )}
        </>
    )
}
export default Index;