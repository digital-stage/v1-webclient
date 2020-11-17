/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import * as React from 'react';
import { Heading, jsx } from 'theme-ui';
import Layout from '../components/Layout';
import Loading from '../components/new/elements/Loading';
import useStageActions from '../lib/digitalstage/useStageActions';
import useStageSelector from '../lib/digitalstage/useStageSelector';

const Leave = (): JSX.Element => {
  const router = useRouter();
  const ready = useStageSelector<boolean>((state) => state.ready);
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);
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
