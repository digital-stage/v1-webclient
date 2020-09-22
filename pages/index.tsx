import DeviceView from "../components/devices/DeviceView";
import {DisplayMedium, HeadingLarge} from "baseui/typography";
import React from "react";
import {useDevices} from "../lib/digitalstage/useDevices";
import StageListView from "../components/stage/StageListView";
import {useAuth} from "../lib/digitalstage/useAuth";
import Login from "./login";
import {styled} from "baseui";
import {useStages} from "../lib/digitalstage/useStages";
import {Button} from "baseui/button";
import Container from "../components/theme/Container";
import Loading from "../components/theme/Loading";
import {useRouter} from "next/router";

const DEBUG = false;

const TextArea = styled("textarea", {
    width: "100%",
    minHeight: "300px"
});

const Index = () => {
    const {localDevice, remoteDevices, logs} = useDevices();
    const {stage, leaveStage} = useStages();
    const router = useRouter();

    const {loading, user} = useAuth();

    if (loading) {
        return <Loading>
            <DisplayMedium>Loading ...</DisplayMedium>
        </Loading>;
    }

    if (!user) {
        console.log("Forwarding to login");
        router.push("/login");
    }

    return (
        <Container>
            {DEBUG && <TextArea rows={10} cols={50} value={logs}/>}
            <>
                <HeadingLarge>Meine Bühnen</HeadingLarge>
                <StageListView/>
            </>
            {stage && (
                <div>
                    <HeadingLarge>Aktuelle Bühne</HeadingLarge>
                    <pre>
                        {JSON.stringify(stage, null, 2)}
                    </pre>
                    <Button onClick={() => leaveStage()}>
                        Bühne verlassen
                    </Button>
                </div>
            )}
            <>
                <HeadingLarge>Dieses Gerät</HeadingLarge>
            </>
            {localDevice && <DeviceView device={localDevice}/>}
            {remoteDevices && (
                <>
                    <h2>Meine anderen Geräte</h2>
                    {remoteDevices.map(remoteDevices => <DeviceView device={remoteDevices}/>)}
                </>
            )}
        </Container>
    )
}
export default Index;