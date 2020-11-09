/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Box, Heading } from 'theme-ui';
import { Avatar } from 'baseui/avatar';
import { FaVideo, FaVideoSlash } from 'react-icons/fa';
import OnlineStatus from '../OnlineStatus';
import {
  ExtendedStageMember,
  useIsStageAdmin,
} from '../../../../lib/digitalstage/useStageSelector';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import VideoPlayer from '../VideoPlayer';

const StageMemberTitle = (props: { stageMember: ExtendedStageMember }) => {
  const { stageMember } = props;

  const { updateStageMember } = useStageActions();
  const isAdmin = useIsStageAdmin();

  return (
    <Flex
      sx={{
        width: 'calc(100% - 2rem)',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          margin: '.5rem',
          flexGrow: 0,
        }}
      >
        <Avatar name={stageMember.name} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
        }}
      >
        <Heading as="h5">{stageMember.name}</Heading>
      </Box>

      {isAdmin && (
        <Flex
          role="presentation"
          sx={{
            flexGrow: 0,
            cursor: 'pointer',
          }}
          onClick={() =>
            updateStageMember(stageMember._id, {
              isDirector: !props.stageMember.isDirector,
            })
          }
        >
          {stageMember.isDirector ? <FaVideo /> : <FaVideoSlash />}
        </Flex>
      )}
      <OnlineStatus
        overrides={{
          display: 'flex',
          flexGrow: 0,
        }}
        online={stageMember.online}
      />
    </Flex>
  );
};

const StageMemberView = (props: { stageMember: ExtendedStageMember }) => {
  const { stageMember } = props;

  return (
    <Flex
      sx={{
        position: 'relative',
        width: ['50%', '25%'],
        backgroundImage: 'url("/images/white_logo.png")',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '20%',
      }}
    >
      <Box sx={{ pt: '100%' }} />
      {stageMember.videoConsumers.length > 0 && (
        <VideoPlayer
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          consumers={stageMember.videoConsumers}
        />
      )}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <StageMemberTitle stageMember={stageMember} />
      </Box>
    </Flex>
  );
};

export default StageMemberView;
