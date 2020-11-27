/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { ImPhoneHangUp } from 'react-icons/im';
import { Box, Button, Flex, jsx } from 'theme-ui';
import { useLocalDevice } from '../lib/use-digital-stage/hooks';
import useStageActions from '../lib/use-digital-stage/useStageActions';
import MobileSideBar from './new/elements/Menu/SideBar/MobileSideBar';
import SettingsModal from './settings';
import MixingPanelModal from './MixingPanelModal';
import { useAudioContext } from '../lib/useAudioContext';

const StageDeviceController = (): JSX.Element => {
  const localDevice = useLocalDevice();
  const { updateDevice } = useStageActions();
  const { audioContext, createAudioContext } = useAudioContext();
  const [valid, setValid] = useState<boolean>(audioContext && audioContext.state === 'running');
  const [openMobileSideBar, setMobileSideBarOpen] = React.useState<boolean>(false);
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<string>();
  const [openMixer, setOpenMixer] = React.useState<boolean>(false);
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

  useEffect(() => {
    setValid(audioContext && audioContext.state === 'running');
  }, [audioContext]);

  // TODO: [DS-71] @delude88 please check business logic
  const start = useCallback(() => {
    if (!audioContext) {
      return createAudioContext().then((createdAudioContext) => {
        if (createdAudioContext.state === 'suspended') {
          return createdAudioContext.resume().then(() => {
            if (createdAudioContext.state === 'running') setValid(true);
          });
        }
        return null;
      });
    }
    return audioContext.resume().then(() => {
      if (audioContext.state === 'running') setValid(true);
    });
  }, [audioContext]);

  return (
    <Box>
      <Flex
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translate(-50%, 0)',
          width: '280px',
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
            {localDevice.sendAudio ? (
              <FaMicrophone size="24px" />
            ) : (
              <FaMicrophoneSlash size="24px" />
            )}
          </Button>
        )}

        <Button variant={valid ? 'circleGray' : 'circle'} onClick={() => start()}>
          {valid ? (
            <GiSpeakerOff size={24} name="Speaker off" />
          ) : (
            <GiSpeaker size={24} name="Speaker on" />
          )}
        </Button>

        <Link href="/leave">
          <Button variant="circle" title="Bühne verlassen" sx={{ bg: 'primary', color: 'text' }}>
            <ImPhoneHangUp size="24px" />
          </Button>
        </Link>
        <Box sx={{ display: ['block', 'none'] }}>
          <Button variant="circleGray" title="Settings" onClick={() => setMobileSideBarOpen(true)}>
            <BsThreeDotsVertical size="24px" />
          </Button>
        </Box>
        <div ref={node}>
          <MobileSideBar
            isOpen={openMobileSideBar}
            onSelect={(selected) => {
              if (selected !== 'mixer') {
                setSelected(selected);
                setOpenSettings(true);
                setMobileSideBarOpen(false);
              } else if (selected === 'mixer') {
                setOpenMixer(true);
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
    </Box>
  );
};

export default StageDeviceController;
