/** @jsxRuntime classic */
/** @jsx jsx */
import {Box, Flex, Heading, jsx} from 'theme-ui';
import StageChat from '../components/chat/StageChat';
import useDigitalStage, { useSelector } from '../lib/use-digital-stage';
import { useRouter } from 'next/router';
import React from 'react';
import {useIntl} from "react-intl";

const Chat = (): JSX.Element => {
  const router = useRouter();
  const ready = useSelector<boolean>((state) => state.global.ready);
  const isInsideStage = useSelector<boolean>((state) => !!state.global.stageId);
  const { formatMessage } = useIntl();
    const f = (id) => formatMessage({ id });

  if (ready && !isInsideStage) {
    router.replace('/');
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        p: 4,
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
          <Heading
              variant="h4"
              sx={{
                  pt: 2,
                  pb: 4
              }}
          >
              {f('chat')}
          </Heading>
        <StageChat />
      </Flex>
    </Box>
  );
};
export default Chat;
