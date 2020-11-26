/** @jsxRuntime classic */
/** @jsx jsx */
import Link from 'next/link';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { ImPhoneHangUp } from 'react-icons/im';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Button, Flex, jsx, Box } from 'theme-ui';
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
        zIndex: 10,
      }}
    >
      {localDevice?.canVideo && (
        <Button
          variant={!localDevice.sendVideo ? 'circleGray' : 'circle'}
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
          variant={!localDevice.sendAudio ? 'circleGray' : 'circle'}
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
          <ImPhoneHangUp size="24px" />
        </Button>
      </Link>
      <Box sx={{ display: ['block', 'none'] }}>
        <Button variant="circleGray" title="Settings">
          <BsThreeDotsVertical size="24px" />
        </Button>
      </Box>
    </Flex>
  );
};

export default StageDeviceController;
