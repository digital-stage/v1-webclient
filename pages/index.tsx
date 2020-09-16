import DeviceView from "../components/DeviceView";
import {HeadingLarge} from "baseui/typography";
import React from "react";
import {useDevices} from "../lib/digitalstage/useDevices";
import StageListView from "../components/stage/StageListView";
import {useAuth} from "../lib/digitalstage/useAuth";
import Login from "./login";
import {styled} from "baseui";
import {useStages} from "../lib/digitalstage/useStages";
import {Button} from "baseui/button";

const TextArea = styled("textarea", {
    width: "100%",
    minHeight: "300px"
});

const Index = () => {
    const {localDevice, remoteDevices, logs} = useDevices();
    const {stage, leaveStage} = useStages();

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
            {stage && (
                <div>
                    <HeadingLarge>STAGE</HeadingLarge>
                    <pre>
                        {JSON.stringify(stage, null, 2)}
                    </pre>
                    <Button onClick={() => leaveStage()}>
                        Bühne verlassen
                    </Button>
                </div>
            )}
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