/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Box, Heading, IconButton } from 'theme-ui';
import { FaVideo, FaVideoSlash } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import {
  StageMemberWithUserData,
  useIsStageAdmin,
  useStageActions,
} from '../../lib/use-digital-stage';
import OnlineStatus from '../new/elements/OnlineStatus';
import useVideoConsumersByStageMember from '../../lib/use-digital-stage/hooks/useVideoConsumersByStageMember';
import VideoPlayer from '../new/elements/VideoPlayer3';

const StageMemberTitle = (props: { stageMember: StageMemberWithUserData; withIcon?: boolean }) => {
  const { stageMember, withIcon } = props;

  const { updateStageMember } = useStageActions();
  const isAdmin = useIsStageAdmin();

  return (
    <Flex
      sx={{
        flexDirection: withIcon ? 'column' : 'row',
        textAlign: 'center',
        alignItems: 'center',
        height: withIcon ? '100%' : 'auto',
        justifyContent: 'center',
      }}
    >
      {withIcon && <HiUserCircle size={60} sx={{ color: 'gray.3' }} />}
      <Box sx={{ position: !withIcon ? 'absolute' : 'static', bottom: '0px', left: '0px' }}>
        <Heading as="h5" sx={{ display: withIcon ? 'block' : 'inline-block' }}>
          <OnlineStatus online={stageMember.online} /> {stageMember.name}
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
    </Flex>
  );
};

const StageMemberView = ({
  stageMember,
}: {
  stageMember: StageMemberWithUserData;
}): JSX.Element => {
  const videoConsumers = useVideoConsumersByStageMember(stageMember._id);

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: videoConsumers.length <= 0 && 'url("/images/user_background.svg")',
        // width: '100%',
        // height: '100%',
        height: '240px',
        width: '240px',
        m:1
      }}
    >
      {videoConsumers.length > 0 && (
        <VideoPlayer sx={{ position: 'relative' }} consumers={videoConsumers} />
      )}
      <StageMemberTitle stageMember={stageMember} withIcon={videoConsumers.length <= 0} />
    </Box>
  );
};

export default StageMemberView;
