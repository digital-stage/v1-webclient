import {Button, KIND, SHAPE, SIZE} from "baseui/button";
import React from "react";
import {useStages, useStageSelector} from "../../../lib/digitalstage/useStages";
import {useDevices} from "../../../lib/digitalstage/useDevices";
import { Device } from "../../../lib/digitalstage/common/model.server";

const DeviceControl = (props: {
    device?: Device;
    shape?: SHAPE[keyof SHAPE];
    size?: SIZE[keyof SIZE];
    kind?: KIND[keyof KIND];
    spacing?: number;
}) => {
    const {updateDevice} = useDevices();
    const {darkMode} = useStageSelector(state => {
        return {
            darkMode: state.current !== undefined
        }
    })

    if (!props.device) {
        return null;
    }

    return (
        <>
            {props.device.canVideo && (
                <Button
                    overrides={props.spacing && {
                        BaseButton: {
                            style: {
                                marginRight: props.spacing + "px"
                            }
                        }
                    }}
                    shape={props.shape}
                    kind={props.kind}
                    size={props.size}
                    onClick={() => updateDevice(props.device._id, {sendVideo: !props.device.sendVideo})}
                >
                    {darkMode ? (
                        <img src={props.device.sendVideo ? "videocam-black-18dp.svg" : "videocam_off-black-18dp.svg"}/>
                    ) : (
                        <img src={props.device.sendVideo ?  "videocam-white-18dp.svg" : "videocam_off-white-18dp.svg"}/>
                    )}
                </Button>
            )}

            {props.device.canAudio && (
                <Button
                    overrides={props.spacing && {
                        BaseButton: {
                            style: {
                                marginRight: props.spacing + "px"
                            }
                        }
                    }}
                    shape={props.shape}
                    kind={props.kind}
                    size={props.size}
                    onClick={() => updateDevice(props.device._id, {sendAudio: !props.device.sendAudio})}
                >
                    {darkMode ? (
                        <img src={props.device.sendAudio ? "mic-black-18dp.svg" : "mic_off-black-18dp.svg"}/>
                    ) : (
                        <img src={props.device.sendAudio ? "mic-white-18dp.svg" : "mic_off-white-18dp.svg"}/>
                    )}
                </Button>
            )}
            {props.device.canVideo && (
                <Button
                    overrides={props.spacing && {
                        BaseButton: {
                            style: {
                                marginRight: props.spacing + "px"
                            }
                        }
                    }}
                    shape={props.shape}
                    kind={props.kind}
                    size={props.size}
                    onClick={() => updateDevice(props.device._id, {receiveVideo: !props.device.receiveVideo})}
                >
                    {darkMode ? (
                        <img src={props.device.receiveVideo ? "live_tv-black-18dp.svg" : "tv_off-black-18dp.svg"}/>
                    ) : (
                        <img src={props.device.receiveVideo ? "live_tv-white-18dp.svg" : "tv_off-white-18dp.svg"}/>
                    )}
                </Button>
            )}
            {props.device.canAudio && (
                <Button
                    shape={props.shape}
                    kind={props.kind}
                    size={props.size}
                    onClick={() => updateDevice(props.device._id, {receiveAudio: !props.device.receiveAudio})}
                >
                    {darkMode ? (
                        <img
                            src={props.device.receiveAudio ? "volume_up-black-18dp.svg" : "volume_off-black-18dp.svg"}/>
                    ) : (
                        <img
                            src={props.device.receiveAudio ? "volume_up-white-18dp.svg" : "volume_off-white-18dp.svg"}/>
                    )}
                </Button>
            )}
        </>
    );
}
export default DeviceControl;
