import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@material-ui/core';
import Loading from '../components/complex/depreacted/theme/Loading';
import useStageActions from '../lib/digitalstage/useStageActions';
import useStageSelector from '../lib/digitalstage/useStageSelector';

const Leave = () => {
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
      <Typography variant="h1">Verlasse Bühne...</Typography>
    </Loading>
  );
};
export default Leave;
