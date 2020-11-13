/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Button } from 'theme-ui';
import Link from 'next/link';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from 'react-icons/fa';
import useStageActions from '../lib/digitalstage/useStageActions';
import useStageSelector from '../lib/digitalstage/useStageSelector';

const StageDeviceController = (): JSX.Element => {
  const { localDevice } = useStageSelector((state) => ({
    localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined,
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
        width: '228px',
        justifyContent: 'space-between',
        pb: '1rem',
        zIndex: 100,
      }}
    >
      {localDevice.canVideo && (
        <Button
          variant="circle"
          title={localDevice.sendVideo ? 'Kamera deaktivieren' : 'Kamera aktivieren'}
          onClick={() =>
            updateDevice(localDevice._id, {
              sendVideo: !localDevice.sendVideo,
            })
          }
        >
          {localDevice.sendVideo ? <FaVideo size="24px" /> : <FaVideoSlash size="24px" />}
        </Button>
      )}
      {localDevice.canAudio && (
        <Button
          variant="circle"
          title={localDevice.sendAudio ? 'Mikrofon deaktivieren' : 'Mikrofon aktivieren'}
          onClick={() =>
            updateDevice(localDevice._id, {
              sendAudio: !localDevice.sendAudio,
            })
          }
        >
          {localDevice.sendAudio ? <FaMicrophone size="24px" /> : <FaMicrophoneSlash size="24px" />}
        </Button>
      )}
      <Link href="/leave">
        <Button variant="circle" title="Bühne verlassen" sx={{ bg: 'primary', color: 'text' }}>
          <FaPhoneSlash size="24px" />
        </Button>
      </Link>
    </Flex>
  );
};

export default StageDeviceController;
