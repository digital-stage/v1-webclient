import React from "react";
import {Device} from "../../../lib/digitalstage/common/model.server";
import useStageActions from "../../../lib/digitalstage/useStageActions";
import Icon2 from "../../base/Icon2";
import i18n from "../../../i18n";
import IconButton from "../../elements/IconButton";

const DeviceControl = (props: {
    device?: Device;
    spacing?: number;
}) => {
    const {t} = i18n.useTranslation("devices");
    const {updateDevice} = useStageActions();

    if (!props.device) {
        return null;
    }

    return (
        <>
            {props.device.canVideo && (
                <IconButton
                    color="secondary"
                    size="medium"
                    onClick={() => updateDevice(props.device._id, {sendVideo: !props.device.sendVideo})}
                >
                    <Icon2
                        label={props.device.sendVideo ? t('switch-cam-off') : t('switch-cam-on')}
                        name={props.device.sendVideo ? "cam-on" : "cam-off"}
                    />
                </IconButton>
            )}

            {props.device.canAudio && (
                <IconButton
                    color="inherit"
                    size="medium"
                    onClick={() => updateDevice(props.device._id, {sendAudio: !props.device.sendAudio})}
                >
                    <Icon2
                        label={props.device.sendAudio ? t('switch-mic-off') : t('switch-mic-on')}
                        name={props.device.sendAudio ? "mic-on" : "mic-off"}
                    />
                </IconButton>
            )}
        </>
    );
}
export default DeviceControl;
