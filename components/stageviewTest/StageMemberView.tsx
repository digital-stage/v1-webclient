/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Box, Heading, IconButton } from 'theme-ui';
import { FaVideo, FaVideoSlash } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import { StageMemberWithUserData, useIsStageAdmin, useStageActions } from '../../lib/use-digital-stage';
import OnlineStatus from '../new/elements/OnlineStatus';
import useVideoConsumersByStageMember from '../../lib/use-digital-stage/hooks/useVideoConsumersByStageMember';
import VideoPlayer from '../new/elements/VideoPlayer';

const StageMemberTitle = (props: { stageMember: StageMemberWithUserData; withIcon?: boolean }) => {
  const { stageMember, withIcon } = props;

  const { updateStageMember } = useStageActions();
  const isAdmin = useIsStageAdmin();

  return (
    <Flex
      sx={{
        flexDirection: withIcon ? 'column' : 'row',
        textAlign:'center',
        alignItems:'center',
        height: withIcon ? '100%' : 'auto',
        justifyContent:'center',
        // position:'absolute',
        // bottom:'0'
      }}
    >
      {withIcon && <HiUserCircle size={80}  sx={{color:'gray.3'}}/>}

      <Heading as="h5">
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
        position:'relative',
        backgroundImage: 'url("/images/user_background.svg")',
        width: '100%',
        height: "100%"
      }}
    >
      {videoConsumers.length > 0 && (
        <VideoPlayer
          // sx={{
          //   width: '100%',
          //   height: '100%',
          // }}
          consumers={videoConsumers}
        />
      )}
      <StageMemberTitle stageMember={stageMember} withIcon={videoConsumers.length <= 0} />
    </Box >
    // <Flex
    //   sx={{
    //     position: 'relative',
    //     backgroundImage: 'url("/images/user_background.svg")',
    //     backgroundPosition: 'center',
    //     backgroundRepeat: 'no-repeat',
    //     backgroundSize: '100%',
    //   }}
    // >
    //   <Box sx={{ pt: '100%' }} />
    //   {videoConsumers.length > 0 && (
    //     <VideoPlayer
    //       sx={{
    //         position: 'absolute',
    //         top: 0,
    //         left: 0,
    //         width: '100%',
    //         height: '100%',
    //       }}
    //       consumers={videoConsumers}
    //     />
    //   )}
    //   <Box
    //     sx={{
    //       position: 'absolute',
    //       bottom: 0,
    //       textAlign: videoConsumers.length <= 0 ? 'center' : 'left',
    //       width: videoConsumers.length <= 0 && '100%',
    //       height: videoConsumers.length <= 0 && '100%',
    //     }}
    //   >
    //     <StageMemberTitle stageMember={stageMember} withIcon={videoConsumers.length <= 0} />
    //   </Box>
    // </Flex>
  );
};

export default StageMemberView;
