import React from "react";
import {useStyletron} from "styletron-react";
import {styled} from "baseui";
import {Card, StyledAction, StyledBody} from "baseui/card/index";
import {Checkbox} from "baseui/checkbox/index";
import {Check, Delete} from "baseui/icon/index";
import {Button, KIND, SIZE} from "baseui/button/index";
import {Device} from "../../lib/digitalstage/common/model.common";
import SingleSelect from "../theme/SingleSelect";
import {useDevices} from "../../lib/digitalstage/useDevices";


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
                <div className={css({
                    width: "100%",
                    display: "flex"
                })}>
                    <Button
                        size={SIZE.compact}
                        kind={props.device.sendVideo ? KIND.primary : KIND.secondary}
                        onClick={() => {
                            updateDevice(props.device._id, {
                                sendVideo: !props.device.sendVideo
                            });
                        }}
                    >
                        Send video
                    </Button>
                    <Button
                        size={SIZE.compact}
                        isSelected={props.device.sendAudio}
                        kind={props.device.sendAudio ? KIND.primary : KIND.secondary}
                        onClick={() => {
                            updateDevice(props.device._id, {
                                sendAudio: !props.device.sendAudio
                            });
                        }}
                    >
                        Send Audio
                    </Button>
                    <Button
                        size={SIZE.compact}
                        kind={props.device.receiveVideo ? KIND.primary : KIND.secondary}
                        onClick={() => {
                            updateDevice(props.device._id, {
                                receiveVideo: !props.device.receiveVideo
                            });
                        }}
                    >
                        Receive Video
                    </Button>
                    <Button
                        size={SIZE.compact}
                        kind={props.device.receiveAudio ? KIND.primary : KIND.secondary}
                        onClick={() => {
                            updateDevice(props.device._id, {
                                receiveAudio: !props.device.receiveAudio
                            });
                        }}
                    >
                        Receive Audio
                    </Button>
                </div>
                <div className={css({
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap'
                })}>
                    <SingleSelect
                        className={css({
                            flexBasis: 0,
                            maxWidth: "100%",
                            flexGrow: 1
                        })}
                        options={props.device.inputAudioDevices || []}
                        id={props.device.inputAudioDevice}
                        onSelect={(id) => updateDevice(props.device._id, {
                            inputAudioDevice: id
                        })}
                    />
                    <SingleSelect
                        className={css({
                            flexBasis: 0,
                            maxWidth: "100%",
                            flexGrow: 1
                        })}
                        options={props.device.outputAudioDevices || []}
                        id={props.device.outputAudioDevice}
                        onSelect={(id) => updateDevice(props.device._id, {
                            outputAudioDevice: id
                        })}
                    />
                    <SingleSelect
                        className={css({
                            flexBasis: 0,
                            maxWidth: "100%",
                            flexGrow: 1
                        })}
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