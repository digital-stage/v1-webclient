/** @jsxRuntime classic */
/** @jsx jsx */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Box, Button, Flex, jsx } from 'theme-ui';
import { useCurrentStageId, useLocalDevice } from '../lib/use-digital-stage/hooks';
import {
  FaMapMarkerAlt,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPlay,
  FaVideo,
  FaVideoSlash,
  FaVolumeUp,
} from 'react-icons/fa';
import useAudioContext from '../lib/useAudioContext';
import useStageActions from '../lib/use-digital-stage/useStageActions';
import Link from 'next/link';
import { ImPhoneHangUp } from 'react-icons/im';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Modal from '../components/old/ui/Modal';
import DigitalStageLogo from '../components/DigitalStageLogo';
import { GoSettings } from 'react-icons/go';

enum AvailableModal {
  AUDIO = 'audio',
  VIDEO = 'video',
  PROFILE = 'profile',
  MIXER = 'mixer',
  DEVICES = 'devices',
  ROOM = 'room',
}

interface NavItem {
  label: string;
  icon?: React.ReactNode;
  modal: AvailableModal;
}

const DesktopMenuItems: NavItem[] = [
  {
    label: 'Video',
    icon: <FaVolumeUp name="settings" />,
    modal: AvailableModal.VIDEO,
  },
  {
    label: 'Audio',
    icon: <GoSettings name="settings" />,
    modal: AvailableModal.AUDIO,
  },
  {
    label: 'Mixer',
    icon: <GoSettings name="mixer" />,
    modal: AvailableModal.AUDIO,
  },
  {
    label: '3D',
    icon: <FaMapMarkerAlt name="3daudio" />,
    modal: AvailableModal.AUDIO,
  },
];
const MobileMenuItems: NavItem[] = DesktopMenuItems;

interface TModalContext {
  setModal(modal: AvailableModal | undefined);

  modal?: AvailableModal;
}

const ModalContext = createContext<TModalContext>({
  setModal: () => {
    throw new Error('Please wrap DOM Tree with modal provider');
  },
});

const Sidebar = (): JSX.Element => {
  const { setModal } = useContext(ModalContext);
  return (
    <Flex
      sx={{
        display: ['none', 'flex'],
        flexGrow: 0,
        height: '100vh',
        paddingTop: '16px',
        paddingBottom: '16px',
        backgroundColor: 'red',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Link sx={{ color: 'text' }} href="https://www.digital-stage.org">
          <a target="_blank">
            <DigitalStageLogo single icon width={30} />
          </a>
        </Link>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {DesktopMenuItems.map((item, index) => (
          <Flex
            key={item.label}
            tabIndex={index}
            role="presentation"
            onClick={() => setModal(item.modal)}
            sx={{
              flexDirection: 'column',
              color: 'gray.1',
              alignItems: 'center',
              ':hover': { color: 'text' },
              px: '1rem',
              outline: 'none',
              textAlign: 'center',
              py: 3,
              cursor: 'pointer',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Flex>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        BOTTOM
      </Box>
    </Flex>
  );
};

const ActionBarSubMenu = (): JSX.Element => {
  const { setModal } = useContext(ModalContext);
  return (
    <Box
      sx={{
        display: ['flex', 'none'],
        position: 'fixed',
        top: '-110px',
        left: '-25px',
        width: 'auto',
        height: 'auto',
        bg: 'gray.3',
        transition: 'background 6s ease-in-out',
        p: 4,
        boxShadow: '0px 3px 6px #000000BC',
        borderRadius: 'card',
        zIndex: 50,
      }}
    >
      {MobileMenuItems.map((item, index) => (
        <Flex
          key={item.label}
          tabIndex={index}
          role="presentation"
          onClick={() => setModal(item.modal)}
          sx={{
            flexDirection: 'column',
            color: 'gray.1',
            alignItems: 'center',
            ':hover': { color: 'text' },
            px: '1rem',
            outline: 'none',
            textAlign: 'center',
            py: 3,
            cursor: 'pointer',
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </Flex>
      ))}
    </Box>
  );
};

const ActionBar = (): JSX.Element => {
  const { audioContext, started } = useAudioContext();
  const localDevice = useLocalDevice();
  const { updateDevice } = useStageActions();
  const [subMenuOpen, setSubMenuOpen] = useState<boolean>();
  const { modal } = useContext(ModalContext);

  useEffect(() => {
    if (modal) setSubMenuOpen(false);
  }, [modal]);

  return (
    <>
      {subMenuOpen && (
        <Box
          sx={{
            display: ['flex', 'none'],
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setSubMenuOpen(false)}
        />
      )}
      <Flex
        sx={{
          position: 'fixed',
          bottom: '1rem',
          justifyContent: 'space-between',
          left: '50%',
          transform: 'translate(-50%, 0px)',
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
            onClick={() => setSubMenuOpen((prev) => !prev)}
          >
            <BsThreeDotsVertical size="24px" />
          </Button>
        </Box>
        {subMenuOpen && <ActionBarSubMenu />}
      </Flex>
    </>
  );
};

const ModalHandler = () => {
  const { modal, setModal } = useContext<TModalContext>(ModalContext);

  if (modal) {
    return (
      <Modal open={!!modal} onClose={() => setModal(undefined)} closeOnBackdropClicked={true}>
        HEY
      </Modal>
    );
  }
  return null;
};

const Layout = (): JSX.Element => {
  const stageId = useCurrentStageId();
  const [modal, setModal] = useState<AvailableModal | undefined>(undefined);

  return (
    <ModalContext.Provider
      value={{
        modal,
        setModal,
      }}
    >
      <Flex
        sx={{
          minWidth: '0px',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
      >
        {stageId && <Sidebar />}

        <Box
          sx={{
            position: 'relative',
            flexGrow: 1,
            height: '100vh',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              width: '100%',
              height: '100%',
              overflow: 'auto',
            }}
          >
            CONTENT
            <Box
              sx={{
                margin: '5rem',
                minHeight: '120vh',
                border: '4px solid yellow',
              }}
            >
              BIG FAT BOX TO MAKE SCROLLING NECESSARY
            </Box>
          </Box>
        </Box>
      </Flex>

      <ActionBar />

      <ModalHandler />
    </ModalContext.Provider>
  );
};

export default Layout;
