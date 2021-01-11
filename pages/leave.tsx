/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import * as React from 'react';
import { Heading, jsx } from 'theme-ui';
import Layout from '../components/Layout';
import Loading from '../components/old/global/Loading';
import useStageActions from '../lib/use-digital-stage/useStageActions';
import { useCurrentStageId, useSelector } from '../lib/use-digital-stage/hooks';

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
    <Layout>
      <Loading>
        <Heading as="h1">Bühne verlassen ...</Heading>
      </Loading>
    </Layout>
  );
};
export default Leave;
