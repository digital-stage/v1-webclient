import React from 'react';
import { useRouter } from 'next/router';
import useDigitalStage, { useSelector } from '../lib/use-digital-stage';
import MixingPanel from '../components/mixer/MixingPanel';

const Mixer = (): JSX.Element => {
  const router = useRouter();
  const { ready } = useDigitalStage();
  const stageId = useSelector<string>((state) => state.global.stageId);

  if (ready && !stageId) {
    router.push('/');
  }

  return <MixingPanel />;
};
export default Mixer;
