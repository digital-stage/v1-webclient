import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Display } from 'baseui/typography';
import Loading from '../components/new/elements/Loading';
import useStageActions from '../lib/digitalstage/useStageActions';
import useStageSelector from '../lib/digitalstage/useStageSelector';

const Leave = (): JSX.Element => {
  const router = useRouter();
  const ready = useStageSelector<boolean>((state) => state.ready);
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);
  const { leaveStage } = useStageActions();

  useEffect(() => {
    if (ready) {
      if (stageId) leaveStage();
      else router.push('/');
    }
  }, [ready, stageId]);

  return (
    <Loading>
      <Display>Verlasse Bühne...</Display>
    </Loading>
  );
};
export default Leave;
