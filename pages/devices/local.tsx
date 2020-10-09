import React from "react";
import Container from "../../components/theme/Container";
import DeviceView from "../../components/devices/DeviceView";
import useStageSelector from "../../lib/digitalstage/useStageSelector";

const Local = () => {
    const {localDevice} = useStageSelector(state => ({
        localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined
    }));

    return (
        <Container>
            <h2>Dieses Gerät</h2>
            {localDevice && <DeviceView device={localDevice}/>}
        </Container>
    );
}
export default Local;