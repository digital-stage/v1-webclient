import React from 'react';
import { useRouter } from 'next/router';
import useDigitalStage, { Stage, useSelector, useStageActions } from '../lib/use-digital-stage';
import { Box, Flex, Heading, jsx } from 'theme-ui';
import MixingPanel from '../components/mixer/MixingPanel';
import { useAuth } from '../lib/useAuth';

const Mixer = (): JSX.Element => {
  const router = useRouter();
  const { ready } = useDigitalStage();
  const stageId = useSelector<string>((state) => state.global.stageId);
  const { loading, user } = useAuth();

  if (!loading && !user) {
    router.replace('/account/login');
  }

  if (ready && !stageId) {
    router.replace('/stages');
  }

  return (
    <Box
      sx={{
        display: 'inline-block',
        p: [0, 4],
        minHeight: '100vh',
        minWidth: '100%',
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          position: 'relative',
          boxShadow: ['none', 'default'],
          borderRadius: ['none', 'card'],
          bg: 'gray.4',
          pt: [0, 4],
          px: [0, 4],
          pb: 10,
          minWidth: '100%',
          minHeight: '100vh',
          maxHeight: ['100%', 'inherit'],
        }}
      >
        <MixingPanel />
      </Flex>
    </Box>
  );
};
export default Mixer;
