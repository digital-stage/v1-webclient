import React from "react";
import Container from "../../components/theme/Container";
import DeviceView from "../../components/devices/DeviceView";
import {useDevices} from "../../lib/digitalstage/useDevices";

const Index = () => {
    const {localDevice, remoteDevices} = useDevices();

    return (
        <Container>
            <h2>Dieses Gerät</h2>
            {localDevice && <DeviceView device={localDevice}/>}
            {remoteDevices && (
                <>
                    <h2>Meine anderen Geräte</h2>
                    {remoteDevices.map(remoteDevices => <DeviceView device={remoteDevices}/>)}
                </>
            )}
        </Container>
    );
}
export default Index;