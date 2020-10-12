import React from "react";
import Container from "../../components/theme/Container";
import DeviceView from "../../components/devices/DeviceView";
import useStageSelector from "../../lib/digitalstage/useStageSelector";
import {Button} from "baseui/button";
import Link from "next/link";
import {useStyletron} from "baseui";

const Index = () => {
    const {localDevice, remoteDevices} = useStageSelector(state => ({
        localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined,
        remoteDevices: state.devices.remote.map(id => state.devices.byId[id])
    }));
    const [css] = useStyletron();

    return (
        <Container>
            <h2>Dieses Gerät</h2>
            {localDevice && <DeviceView device={localDevice}/>}
            <div className={css({
                marginTop: "2rem",
                marginBottom: "2rem"
            })}>
                <Link href="/test">
                    <Button>Dieses Gerät testen</Button>
                </Link>
            </div>
            {remoteDevices && remoteDevices.length > 0 && (
                <>
                    <h2>Meine anderen Geräte</h2>
                    {remoteDevices.map(remoteDevice => <DeviceView device={remoteDevice}/>)}
                </>
            )}
        </Container>
    );
}
export default Index;