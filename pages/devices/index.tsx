import React, {useCallback, useEffect} from "react";
import Container from "../../components/complex/depreacted/theme/layout/Container";
import DeviceView from "../../components/complex/depreacted/devices/DeviceView";
import useStageSelector from "../../lib/digitalstage/useStageSelector";
import {Button} from "baseui/button";
import Link from "next/link";
import {useStyletron} from "baseui";
import {Device} from "../../lib/digitalstage/common/model.server";
import {enumerateDevices} from "../../lib/digitalstage/useStageContext/utils";
import useStageActions from "../../lib/digitalstage/useStageActions";
import _ from "lodash";

const Index = () => {
    //const devices = useStageSelector<Devices>(state => state.devices);
    //const localDevice = devices.local ? devices.byId[devices.local] : undefined;
    //const remoteDevices = devices.remote.map(id => devices.byId[id])

    const localDevice = useStageSelector<Device>(state => state.devices.local ? state.devices.byId[state.devices.local] : undefined);
    const remoteDevices = useStageSelector<Device[]>(state => state.devices.remote.map(id => state.devices.byId[id]));
    const [css] = useStyletron();

    const {updateDevice} = useStageActions();

    const refreshDevices = useCallback(() => {
        if (localDevice) {
            enumerateDevices()
                .then(devices => {
                        if (!_.isEqual(localDevice.inputAudioDevices, devices.inputAudioDevices)
                            || !_.isEqual(localDevice.inputVideoDevices, devices.inputVideoDevices)
                            || !_.isEqual(localDevice.outputAudioDevices, devices.outputAudioDevices)) {

                            const inputAudioDeviceId = localDevice.inputAudioDeviceId && devices.inputAudioDevices.find(d => d.id === localDevice.inputAudioDeviceId) ? localDevice.inputAudioDeviceId : (devices.inputAudioDevices.find(d => d.id === "label") ? "default" : (devices.inputAudioDevices.length > 0 ? devices.inputAudioDevices[0].id : undefined));
                            const outputAudioDeviceId = localDevice.inputAudioDeviceId && devices.outputAudioDevices.find(d => d.id === localDevice.outputAudioDeviceId) ? localDevice.outputAudioDeviceId : (devices.outputAudioDevices.find(d => d.id === "label") ? "default" : (devices.outputAudioDevices.length > 0 ? devices.outputAudioDevices[0].id : undefined));
                            const inputVideoDeviceId = localDevice.inputVideoDeviceId && devices.inputVideoDevices.find(d => d.id === localDevice.inputVideoDeviceId) ? localDevice.inputVideoDeviceId : (devices.inputVideoDevices.length === 1 ? devices.inputVideoDevices[0].id : "default");

                            updateDevice(localDevice._id, {
                                canAudio: devices.inputAudioDevices.length > 0,
                                canVideo: devices.inputVideoDevices.length > 0,
                                inputAudioDevices: devices.inputAudioDevices,
                                inputVideoDevices: devices.inputVideoDevices,
                                outputAudioDevices: devices.outputAudioDevices,
                                inputAudioDeviceId: inputAudioDeviceId,
                                outputAudioDeviceId: outputAudioDeviceId,
                                inputVideoDeviceId: inputVideoDeviceId
                            })
                        }
                    }
                );
        }
    }, [localDevice])

    useEffect(() => {
        if (localDevice) {
            navigator.mediaDevices.addEventListener("devicechange", () => {
                console.error("HEY");
                refreshDevices();
            })
        }
    }, [localDevice]);

    return (
        <Container>
            <h2>Dieses Gerät</h2>
            {localDevice && <DeviceView device={localDevice}/>}
            <div className={css({
                marginTop: "2rem",
                marginBottom: "2rem"
            })}>
                <Button onClick={() => refreshDevices()}>
                    Dieses Gerät aktualisieren
                </Button>
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