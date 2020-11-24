/** @jsxRuntime classic */
/** @jsx jsx */
import Link from 'next/link';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import { Button, Flex, jsx } from 'theme-ui';
import FixedAudioPlaybackStarterButton from './new/elements/Menu/FixedAudioPlaybackStarterButton';
import { useLocalDevice } from '../lib/use-digital-stage/hooks';
import useStageActions from '../lib/use-digital-stage/useStageActions';

const StageDeviceController = (): JSX.Element => {
  // TODO: @delude88 - please check
  const localDevice = useLocalDevice();
  const { updateDevice } = useStageActions();

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
      {localDevice?.canVideo && (
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
      {localDevice?.canAudio && (
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
      <FixedAudioPlaybackStarterButton />
      <Link href="/leave">
        <Button variant="circle" title="Bühne verlassen" sx={{ bg: 'primary', color: 'text' }}>
          <FaPhoneSlash size="24px" />
        </Button>
      </Link>
    </Flex>
  );
};

export default StageDeviceController;
