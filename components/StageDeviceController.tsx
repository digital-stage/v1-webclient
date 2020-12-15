/** @jsxRuntime classic */
/** @jsx jsx */
import Link from 'next/link';
import React, { useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaMicrophone, FaMicrophoneSlash, FaPlay, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { ImPhoneHangUp } from 'react-icons/im';
import { Box, Button, Flex, jsx } from 'theme-ui';
import { useLocalDevice } from '../lib/use-digital-stage/hooks';
import useStageActions from '../lib/use-digital-stage/useStageActions';
import useAudioContext from '../lib/useAudioContext';
import MixingPanelModal from './MixingPanelModal';
import MobileSideBar from './global/SideBar/MobileSideBar';
import SettingsModal from './settings';
import RoomModal from './RoomModal';

const StageDeviceController = (): JSX.Element => {
  const localDevice = useLocalDevice();
  const { updateDevice } = useStageActions();
  const { audioContext, started } = useAudioContext();
  const [openMobileSideBar, setMobileSideBarOpen] = React.useState<boolean>(false);
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<string>();
  const [openMixer, setOpenMixer] = React.useState<boolean>(false);
  const [openRoom, setOpenRoom] = React.useState<boolean>(false);
  const node = React.useRef(null);

  const handleClick = (e) => {
    if (node && node.current.contains(e.target)) {
      setMobileSideBarOpen(true);
      return;
    }
    setMobileSideBarOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <Box>
      <Flex
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translate(-50%, 0)',
          justifyContent: 'space-between',
          pb: '1rem',
          zIndex: 10,
        }}
      >
        {started || (
          <Button
            variant="function"
            onClick={() => {
              if (audioContext) audioContext.resume();
            }}
            sx={{ mr: [5, 6] }}
          >
            <FaPlay size="16px" name="Start" />
          </Button>
        )}
        {localDevice?.canVideo && (
          <Button
            variant={!localDevice.sendVideo ? 'functionTertiary' : 'function'}
            title={localDevice.sendVideo ? 'Kamera deaktivieren' : 'Kamera aktivieren'}
            onClick={() =>
              updateDevice(localDevice._id, {
                sendVideo: !localDevice.sendVideo,
              })
            }
            sx={{ mr: [5, 6] }}
          >
            {localDevice.sendVideo ? <FaVideo size="24px" /> : <FaVideoSlash size="24px" />}
          </Button>
        )}
        {localDevice?.canAudio && (
          <Button
            variant={!localDevice.sendAudio ? 'functionTertiary' : 'function'}
            title={localDevice.sendAudio ? 'Mikrofon deaktivieren' : 'Mikrofon aktivieren'}
            onClick={() =>
              updateDevice(localDevice._id, {
                sendAudio: !localDevice.sendAudio,
              })
            }
            sx={{ mr: [5, 6] }}
          >
            {localDevice.sendAudio ? (
              <FaMicrophone size="24px" />
            ) : (
              <FaMicrophoneSlash size="24px" />
            )}
          </Button>
        )}
        <Link href="/leave">
          <Button variant="functionDanger" title="Bühne verlassen" sx={{ mr: [6, 0] }}>
            <ImPhoneHangUp size="24px" />
          </Button>
        </Link>
        <Box sx={{ display: ['block', 'none'] }}>
          <Button
            variant="functionTertiary"
            title="Settings"
            onClick={() => setMobileSideBarOpen(true)}
          >
            <BsThreeDotsVertical size="24px" />
          </Button>
        </Box>
        <div ref={node}>
          <MobileSideBar
            isOpen={openMobileSideBar}
            onSelect={(selected) => {
              switch (selected) {
                case 'mixer':
                  setOpenMixer(true);
                  break;
                case 'room':
                  setOpenRoom(true);
                  break;
                default:
                  setSelected(selected);
                  setOpenSettings(true);
                  setMobileSideBarOpen(false);
              }
            }}
          />
        </div>
      </Flex>
      <SettingsModal
        isOpen={openSettings}
        onClose={() => setOpenSettings(false)}
        selected={selected}
      />
      <MixingPanelModal isOpen={openMixer} onClose={() => setOpenMixer(!openMixer)} />
      <RoomModal isOpen={openRoom} onClose={() => setOpenRoom((prev) => !prev)} />
    </Box>
  );
};

export default StageDeviceController;
