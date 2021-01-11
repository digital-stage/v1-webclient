/** @jsxRuntime classic */
/** @jsx jsx */
import Link from 'next/link';
import React, { Fragment } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { ImPhoneHangUp } from 'react-icons/im';
import { Box, Button, Flex, jsx } from 'theme-ui';
import { useLocalDevice, useSelector } from '../../lib/use-digital-stage/hooks';
import { useStageActions } from '../../lib/use-digital-stage';
import PlaybackStarter from './PlaybackStarter';
import { DangerIconButton } from '../../digitalstage-ui/elements/input/IconButton';
import PrimaryToggleButton from '../../digitalstage-ui/elements/input/ToggleButton';

const DeviceController = (): JSX.Element => {
  const localDevice = useLocalDevice();
  const { updateDevice } = useStageActions();
  const stageId = useSelector<string>((state) => state.global.stageId);

  return (
    <Fragment>
      <Flex
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translate(-50%, 0)',
          justifyContent: 'space-between',
          pb: '1rem',
        }}
      >
        {localDevice?.canVideo && (
          <PrimaryToggleButton
            toggled={localDevice.sendVideo}
            title={localDevice.sendVideo ? 'Kamera deaktivieren' : 'Kamera aktivieren'}
            onClick={() =>
              updateDevice(localDevice._id, {
                sendVideo: !localDevice.sendVideo,
              })
            }
            sx={{ mr: [5, 6] }}
          >
            {localDevice.sendVideo ? <FaVideo size="24px" /> : <FaVideoSlash size="24px" />}
          </PrimaryToggleButton>
        )}
        {localDevice?.canAudio && (
          <PrimaryToggleButton
            toggled={localDevice.sendAudio}
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
          </PrimaryToggleButton>
        )}
        {stageId && (
          <Link href="/leave">
            <DangerIconButton title="Bühne verlassen" sx={{ mr: [6, 0] }}>
              <ImPhoneHangUp size="24px" />
            </DangerIconButton>
          </Link>
        )}
        {stageId ? (
          <Box
            sx={{
              display: ['block', 'none'],
            }}
          >
            <Link href="/settings">
              <Button variant="functionTertiary" title="Settings">
                <BsThreeDotsVertical size="24px" />
              </Button>
            </Link>
          </Box>
        ) : (
          <Link href="/settings">
            <Button variant="functionTertiary" title="Settings">
              <BsThreeDotsVertical size="24px" />
            </Button>
          </Link>
        )}
      </Flex>
      <PlaybackStarter />
    </Fragment>
  );
};

export default DeviceController;
