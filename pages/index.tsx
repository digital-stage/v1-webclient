import DeviceView from "../components/DeviceView";
import {HeadingLarge} from "baseui/typography/index";
import React from "react";
import {useDevices} from "../lib/useDevices";
import StageListView from "../components/stage/StageListView";
import {useAuth} from "../lib/useAuth";
import Login from "./login";
import {styled} from "baseui";

const TextArea = styled("textarea", {
    width: "100%",
    minHeight: "300px"
});

const Index = () => {
    const {localDevice, remoteDevices, logs} = useDevices();

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
            <TextArea rows={10} cols={50} value={logs}/>
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