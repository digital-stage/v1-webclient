/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Box, Heading, IconButton } from 'theme-ui';
import { FaVideo, FaVideoSlash } from 'react-icons/fa';
import OnlineStatus from '../OnlineStatus';
import VideoPlayer from '../VideoPlayer';
import { StageMemberWithUserData } from '../../../../lib/use-digital-stage/types';
import { useIsStageAdmin } from '../../../../lib/use-digital-stage/hooks';
import useStageActions from '../../../../lib/use-digital-stage/useStageActions';
import useVideoConsumersByStageMember from '../../../../lib/use-digital-stage/hooks/useVideoConsumersByStageMember';

const StageMemberTitle = (props: { stageMember: StageMemberWithUserData }) => {
  const { stageMember } = props;

  const { updateStageMember } = useStageActions();
  const isAdmin = useIsStageAdmin();

  return (
    <Box
      sx={{
        minWidth: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
      }}
    >
      {/** <Avatar name={stageMember.name} /> */}

      <Heading as="h5">
        <OnlineStatus online={stageMember.online} /> {stageMember.name}{' '}
      </Heading>

      {isAdmin && (
        <IconButton
          onClick={() =>
            updateStageMember(stageMember._id, {
              isDirector: !props.stageMember.isDirector,
            })
          }
        >
          {stageMember.isDirector ? <FaVideo /> : <FaVideoSlash />}
        </IconButton>
      )}
    </Box>
  );
};

const StageMemberView = ({
  stageMember,
}: {
  stageMember: StageMemberWithUserData;
}): JSX.Element => {
  const videoConsumers = useVideoConsumersByStageMember(stageMember._id);

  return (
    <Flex
      sx={{
        position: 'relative',
        backgroundImage: 'url("/images/white_logo.png")',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '20%',
        bg: 'lightblue',
      }}
    >
      <Box sx={{ pt: '100%' }} />
      {videoConsumers.length > 0 && (
        <VideoPlayer
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          consumers={videoConsumers}
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
