/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import * as React from 'react';
import { Heading, jsx } from 'theme-ui';
import Container, { Size } from '../components/Container';
import Layout from '../components/Layout';
import StageListView from '../components/new/elements/StageList';
import PageSpinner from '../components/PageSpinner';
import StageDeviceController from '../components/StageDeviceController';
import { useAuth } from '../lib/useAuth';
import { useCurrentStageId, useStage } from '../lib/use-digital-stage/hooks';
import StageView from '../components/StageView';

const Index = (): JSX.Element => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const stageId = useCurrentStageId();
  const stage = useStage(stageId);

  if (!loading) {
    if (!user) {
      router.push('/account/welcome');
    } else {
      return (
        <Layout sidebar={!!stageId} stage={stage}>
          {stageId ? (
            <React.Fragment>
              <StageView />
              <StageDeviceController />
            </React.Fragment>
          ) : (
            <Container size={Size.stage}>
              <Heading as="h1" sx={{ ml: 4, mt: [6, 7] }}>
                Meine Bühnen
              </Heading>
              <StageListView />
            </Container>
          )}
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <PageSpinner />
    </Layout>
  );
};

export default Index;
