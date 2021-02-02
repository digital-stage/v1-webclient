/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, Flex, jsx } from 'theme-ui';
import StageChat from '../components/chat/StageChat';
import useDigitalStage, { useSelector } from '../lib/use-digital-stage';
import { useRouter } from 'next/router';
import React from 'react';

const Chat = (): JSX.Element => {
  const router = useRouter();
  const ready = useSelector<boolean>((state) => state.global.ready);
  const isInsideStage = useSelector<boolean>((state) => !!state.global.stageId);

  if (ready && !isInsideStage) {
    router.replace('/');
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        p: 4,
        pt: 9,
        pb: 10,
      }}
    >
      <Flex
        sx={{
          boxShadow: 'default',
          borderRadius: 'card',
          bg: 'gray.4',
          p: 4,
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <StageChat />
      </Flex>
    </Box>
  );
};
export default Chat;
