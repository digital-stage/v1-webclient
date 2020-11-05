import React from 'react';
import { Device } from '../../../../lib/digitalstage/common/model.server';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import Icon from '../../../../uikit/Icon';
import ToggleButton from '../../../../uikit/ToggleButton';

const DeviceControl = (props: {
  device?: Device;
}) => {
  const { device } = props;
  const { updateDevice } = useStageActions();

  if (!device) {
    return null;
  }

  return (
    <>
      {device.canVideo && (
        <ToggleButton
          kind="secondary"
          size="large"
          active={device.sendVideo}
          onClick={() => updateDevice(props.device._id, { sendVideo: !props.device.sendVideo })}
        >
          <Icon
            label={device.sendVideo ? 'Kamera deaktivieren' : 'Kamera aktivieren'}
            name={device.sendVideo ? 'cam-on' : 'cam-off'}
          />
        </ToggleButton>
      )}

      {device.canAudio && (
        <ToggleButton
          kind="secondary"
          size="large"
          active={device.sendAudio}
          onClick={() => updateDevice(props.device._id, { sendAudio: !props.device.sendAudio })}
        >
          <Icon
            label={device.sendAudio ? 'Mikrofon deaktivieren' : 'Mikrofon aktivieren'}
            name={device.sendAudio ? 'mic-on' : 'mic-off'}
          />
        </ToggleButton>
      )}
    </>
  );
};
export default DeviceControl;
