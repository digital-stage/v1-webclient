/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Button } from 'theme-ui';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import useStageActions from '../lib/digitalstage/useStageActions';
import useStageSelector from '../lib/digitalstage/useStageSelector';

const StageDeviceController = () => {
  const { localDevice } = useStageSelector((state) => ({
    localDevice: state.devices.local
      ? state.devices.byId[state.devices.local]
      : undefined,
  }));
  const { updateDevice } = useStageActions();

  if (!localDevice) {
    return null;
  }

  return (
    <Flex
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translate(-50%, 0)',
        width: '152px',
        justifyContent: 'space-between',
        pb: '1rem',
        zIndex: 100,
      }}
    >
      {localDevice.canVideo && (
        <Button
          variant="circle"
          label={
            localDevice.sendVideo ? 'Kamera deaktivieren' : 'Kamera aktivieren'
          }
          onClick={() => updateDevice(localDevice._id, {
            sendVideo: !localDevice.sendVideo,
          })}
        >
          {localDevice.sendVideo ? (
            <FaVideo size="24px" />
          ) : (
            <FaVideoSlash size="24px" />
          )}
        </Button>
      )}
      {localDevice.canAudio && (
        <Button
          variant="circle"
          label={
            localDevice.sendAudio
              ? 'Mikrofon deaktivieren'
              : 'Mikrofon aktivieren'
          }
          onClick={() => updateDevice(localDevice._id, {
            sendAudio: !localDevice.sendAudio,
          })}
        >
          {localDevice.sendAudio ? (
            <FaMicrophone size="24px" />
          ) : (
            <FaMicrophoneSlash size="24px" />
          )}
        </Button>
      )}
    </Flex>
  );
};

export default StageDeviceController;
