import React from "react";
import {useStyletron} from "styletron-react";
import {styled} from "baseui";
import {Card, StyledAction, StyledBody} from "baseui/card/index";
import {Checkbox} from "baseui/checkbox/index";
import {Check, Delete} from "baseui/icon/index";
import {Button, KIND} from "baseui/button/index";
import {ButtonGroup} from "baseui/button-group/index";
import {Device} from "../lib/useSocket/model.common";
import SingleSelect from "./atomic/SingleSelect";
import {useDevices} from "../lib/useDevice";


const CardTitle = styled("div", {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
})

const DeviceView = (props: {
    device: Device
}) => {
    const {updateDevice} = useDevices();
    const [css] = useStyletron();

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
                <div className={css({
                    width: '100%',
                    display: 'flex',
                })}>
                    <SingleSelect
                        options={props.device.inputAudioDevices || []}
                        id={props.device.inputAudioDevice}
                        onSelect={(id) => updateDevice(props.device._id, {
                            inputAudioDevice: id
                        })}
                    />
                    <SingleSelect
                        options={props.device.outputAudioDevices || []}
                        id={props.device.outputAudioDevice}
                        onSelect={(id) => updateDevice(props.device._id, {
                            outputAudioDevice: id
                        })}
                    />
                    <SingleSelect
                        options={props.device.inputVideoDevices || []}
                        id={props.device.inputVideoDevice}
                        onSelect={(id) => updateDevice(props.device._id, {
                            inputVideoDevice: id
                        })}
                    />
                </div>
            </StyledAction>
        </Card>
    )
}

export default DeviceView