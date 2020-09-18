import React from "react";
import Container from "../../components/theme/Container";
import DeviceView from "../../components/devices/DeviceView";
import {useDevices} from "../../lib/digitalstage/useDevices";

const Local = () => {
    const {localDevice} = useDevices();

    return (
        <Container>
            <h2>Dieses Gerät</h2>
            {localDevice && <DeviceView device={localDevice}/>}
        </Container>
    );
}
export default Local;