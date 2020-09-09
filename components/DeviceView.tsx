import {useDevice} from "../lib/useDevice";
import React from "react";
import {useStyletron} from "styletron-react";
import {styled} from "baseui";
import {Card, StyledAction, StyledBody} from "baseui/card/index";
import {Checkbox} from "baseui/checkbox/index";
import {Check, Delete} from "baseui/icon/index";
import {Button, KIND} from "baseui/button/index";
import {ButtonGroup} from "baseui/button-group/index";
import {Device} from "../lib/useSocket/model.common";


const CardTitle = styled("div", {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
})

const DeviceView = (props: {
    device: Device
}) => {
    const {updateDevice} = useDevice();
    const [css] = useStyletron();

    console.log("SENDAUDIO: " + props.device.sendAudio);

    return (
        <Card
            title={<CardTitle>{props.device.name} ({props.device._id}){props.device.online ? <Check size={32}/> :
                <Delete size={32}/>}</CardTitle>}

        >
            <StyledBody>
                <Checkbox
                    checked={props.device.canVideo}
                    disabled
                >
                    canVideo
                </Checkbox>
                <Checkbox
                    checked={props.device.canAudio}
                    disabled
                >
                    canAudio
                </Checkbox>
            </StyledBody>
            <StyledAction>
                <ButtonGroup>
                    <Button
                        kind={props.device.sendVideo ? KIND.secondary : KIND.primary}
                        onClick={() => {
                            updateDevice(props.device._id, {
                                sendVideo: !props.device.sendVideo
                            });
                        }}
                    >
                        Send video
                    </Button>
                    <Button
                        isSelected={props.device.sendAudio}
                        kind={props.device.sendAudio ? KIND.primary : KIND.secondary}
                        onClick={() => {
                            updateDevice(props.device._id, {
                                sendAudio: !props.device.sendAudio
                            });
                        }}
                    >
                        Send Audio {props.device.sendAudio ? "X" : "0"}
                    </Button>
                    <Button
                        kind={props.device.receiveVideo ? KIND.secondary : KIND.primary}
                        onClick={() => {
                            updateDevice(props.device._id, {
                                receiveVideo: !props.device.receiveVideo
                            });
                        }}
                    >
                        Receive Video
                    </Button>
                    <Button
                        kind={props.device.receiveAudio ? KIND.secondary : KIND.primary}
                        onClick={() => {
                            updateDevice(props.device._id, {
                                sendAudio: !props.device.receiveAudio
                            });
                        }}
                    >
                        Receive Audio
                    </Button>
                </ButtonGroup>
            </StyledAction>
        </Card>
    )
}

export default DeviceView