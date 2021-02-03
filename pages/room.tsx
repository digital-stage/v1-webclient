import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { useRouter } from 'next/router';
import { useSelector } from '../lib/use-digital-stage';
import RoomManager from '../components/room/RoomManager';

const Room = (): JSX.Element => {
  const router = useRouter();
  const ready = useSelector<boolean>((state) => state.global.ready);
  const isInsideStage = useSelector<boolean>((state) => !!state.global.stageId);

  if (ready && !isInsideStage) {
    router.replace('/');
  }

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        p: [0, 4],
        pb: [0, 10],
      }}
    >
      <Flex
        sx={{
          boxShadow: ['none', 'default'],
          borderRadius: ['none', 'card'],
          bg: 'gray.4',
          py: [0, 6],
          px: [0, 6],
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <RoomManager />
      </Flex>
    </Flex>
  );
};
export default Room;
