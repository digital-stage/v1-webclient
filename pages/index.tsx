/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { useRouter } from 'next/router';
import { jsx, Heading, Text, Box } from 'theme-ui';
import { useAuth } from '../lib/digitalstage/useAuth';
import Loading from '../components/new/elements/Loading';
import useStageSelector from '../lib/digitalstage/useStageSelector';
import PageWrapperWithStage from '../components/new/elements/PageWrapperWithStage';
import StagePane from '../components/new/panes/StagePane';
import StageListView from '../components/new/elements/StageList';

import DeviceControl from '../components/new/elements/DeviceControl';
import FixedLeaveButton from '../components/new/elements/Menu/FixedLeaveButton';
import Layout from '../components/Layout';
import Container from '../components/Container';
import FixedAudioPlaybackStarterButton from '../components/new/elements/Menu/FixedAudioPlaybackStarterButton';

const Index = () => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const stageId = useStageSelector<string | undefined>(state => state.stageId);

  if (!loading) {
    if (!user) {
      router.push('/account/welcome');
    } else {
      // On stage related pages (all except sign in handling) wrap with PagWrapperWithStage
      return (
        <React.Fragment>
          {stageId ? (
            <PageWrapperWithStage>
              <StagePane />
            </PageWrapperWithStage>
          ) : (
            <Layout>
              <Container>
                <div>
                  <h1>My Stages</h1>
                  <StageListView />
                </div>
              </Container>
            </Layout>
          )}

          <DeviceControl />
          <FixedAudioPlaybackStarterButton />
          <FixedLeaveButton />
        </React.Fragment>
      );
    }
  }

  return (
    <Layout>
      <Loading>
        <Heading as="h1">Neues Layout im Anmarsch!</Heading>
      </Loading>
    </Layout>
  );
};

export default Index;
