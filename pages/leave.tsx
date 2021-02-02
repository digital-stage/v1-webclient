/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import * as React from 'react';
import { Heading, jsx } from 'theme-ui';
import useStageActions from '../lib/use-digital-stage/useStageActions';
import { useCurrentStageId, useSelector } from '../lib/use-digital-stage/hooks';
import LoadingOverlay from '../components/global/LoadingOverlay';

const Leave = (): JSX.Element => {
  const router = useRouter();
  const ready = useSelector<boolean>((state) => state.global.ready);
  const stageId = useCurrentStageId();
  const { leaveStage } = useStageActions();

  React.useEffect(() => {
    if (ready) {
      if (stageId) leaveStage();
      else router.push('/');
    }
  }, [ready, stageId]);

  return (
    <LoadingOverlay>
      <Heading as="h1">Bühne verlassen ...</Heading>
    </LoadingOverlay>
  );
};
export default Leave;
