import React from "react";
import Container from "../../components/complex/depreacted/theme/layout/Container";
import DeviceView from "../../components/complex/depreacted/devices/DeviceView";
import useStageSelector from "../../lib/digitalstage/useStageSelector";
import Link from "next/link";
import {Button} from "baseui/button";
import {useStyletron} from "baseui";

const Local = () => {
    const {localDevice} = useStageSelector(state => ({
        localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined
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
        </Container>
    );
}
export default Local;