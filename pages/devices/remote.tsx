import React from "react";
import Container from "../../components/theme/Container";
import DeviceView from "../../components/devices/DeviceView";
import {useDevices} from "../../lib/digitalstage/useDevices";

const Index = () => {
    const {remoteDevices} = useDevices();

    return (
        <Container>
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