import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { useRouter } from 'next/router';
import useDigitalStage, { useSelector } from '../lib/use-digital-stage';

const Mixer = (): JSX.Element => {
  const router = useRouter();
  const { ready } = useDigitalStage();
  const stageId = useSelector<string>((state) => state.global.stageId);

  if (ready && !stageId) {
    router.push('/');
  }

  return <Flex>MIXER</Flex>;
};
export default Mixer;
