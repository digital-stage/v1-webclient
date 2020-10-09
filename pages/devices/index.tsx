import React from "react";
import Container from "../../components/theme/Container";
import DeviceView from "../../components/devices/DeviceView";
import useStageSelector from "../../lib/digitalstage/useStageSelector";

const Index = () => {
    const {localDevice, remoteDevices} = useStageSelector(state => ({
        localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined,
        remoteDevices: state.devices.remote.map(id => state.devices.byId[id])
    }));

    return (
        <Container>
            <h2>Dieses Gerät</h2>
            {localDevice && <DeviceView device={localDevice}/>}
            {remoteDevices && (
                <>
                    <h2>Meine anderen Geräte</h2>
                    {remoteDevices.map(remoteDevice => <DeviceView device={remoteDevice}/>)}
                </>
            )}
        </Container>
    );
}
export default Index;