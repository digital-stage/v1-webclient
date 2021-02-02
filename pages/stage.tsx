import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from '../lib/use-digital-stage';

const Stage = (): JSX.Element => {
  const router = useRouter();
  const ready = useSelector<boolean>((state) => state.global.ready);
  const isInsideStage = useSelector<boolean>((state) => !!state.global.stageId);

  if (ready && !isInsideStage) {
    router.replace('/');
  }

  return <div>STAGE</div>;
};
export default Stage;
