import DeviceView from "../components/DeviceView";
import {HeadingLarge} from "baseui/typography/index";
import React from "react";
import {useDevices} from "../lib/useDevices";
import StageListView from "../components/stage/StageListView";
import {useAuth} from "../lib/useAuth";
import Login from "./login";

const Index = () => {
    const {localDevice, remoteDevices} = useDevices();

    const {loading, user} = useAuth();

    if (loading) {
        return <div>
            Loading...
        </div>
    }

    if (!user) {
        return <Login/>
    }

    return (
        <>
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