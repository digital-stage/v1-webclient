import React from "react";
import {Device} from "../../../lib/digitalstage/common/model.server";
import useStageActions from "../../../lib/digitalstage/useStageActions";
import {useAudioContext} from "../../../lib/useAudioContext";
import Icon2 from "../../base/Icon2";
import {IconButton, Theme, withStyles} from "@material-ui/core";
import i18n from "../../../i18n";

const DeviceIcon = withStyles((theme: Theme) => ({
    root: {
        padding: "1rem",
        color: theme.palette.common.white,
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
        },
        '&:active': {
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
        },
    },
}))(IconButton);

const DeviceControl = (props: {
    device?: Device;
    spacing?: number;
}) => {
    const {t} = i18n.useTranslation("devices");
    const {audioContext} = useAudioContext();
    const {updateDevice} = useStageActions();

    if (!props.device) {
        return null;
    }

    return (
        <>
            {props.device.canVideo && (
                <DeviceIcon
                    color="secondary"
                    size="medium"
                    onClick={() => updateDevice(props.device._id, {sendVideo: !props.device.sendVideo})}
                >
                    <Icon2
                        label={props.device.sendVideo ? t('switch-cam-off') : t('switch-cam-on')}
                        name={props.device.sendVideo ? "cam-on" : "cam-off"}
                    />
                </DeviceIcon>
            )}

            {props.device.canAudio && (
                <DeviceIcon
                    color="inherit"
                    size="medium"
                    onClick={() => updateDevice(props.device._id, {sendAudio: !props.device.sendAudio})}
                >
                    <Icon2
                        label={props.device.sendAudio ? t('switch-mic-off') : t('switch-mic-on')}
                        name={props.device.sendAudio ? "mic-on" : "mic-off"}
                    />
                </DeviceIcon>
            )}
            {props.device.canVideo && (
                <DeviceIcon
                    color="inherit"
                    size="medium"
                    onClick={() => updateDevice(props.device._id, {receiveVideo: !props.device.receiveVideo})}
                >
                    <Icon2
                        label={props.device.sendAudio ? t('switch-display-off') : t('switch-display-on')}
                        name={props.device.receiveVideo ? "display-on" : "display-off"}
                    />
                </DeviceIcon>
            )}
            {props.device.canAudio && (
                <DeviceIcon
                    color="inherit"
                    size="medium"
                    onClick={() => {
                        updateDevice(props.device._id, {receiveAudio: !props.device.receiveAudio})
                        if (audioContext.state === "suspended") {
                            return audioContext.resume();
                        }
                    }}
                >
                    <Icon2
                        label={props.device.sendAudio ? t('switch-speaker-off') : t('switch-speaker-on')}
                        name={props.device.receiveAudio ? "speaker-on" : "speaker-off"}
                    />
                </DeviceIcon>
            )}
        </>
    );
}
export default DeviceControl;
