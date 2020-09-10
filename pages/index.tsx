import DeviceView from "../components/DeviceView";
import {HeadingLarge} from "baseui/typography/index";
import StageListView from "../components/StageListView";
import React from "react";
import {useAuth} from "../lib/useAuth";
import LoginForm from "../components/account/LoginForm";
import {useDevices} from "../lib/useDevice";

const Index = () => {
    const {localDevice, remoteDevices} = useDevices();

    const {loading, user} = useAuth();

    if (loading) {
        return <div>
            Loading...
        </div>
    }

    if (!user) {
        return <LoginForm/>
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