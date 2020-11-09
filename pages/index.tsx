/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { useRouter } from 'next/router';
import { jsx, Heading } from 'theme-ui';
import { useAuth } from '../lib/digitalstage/useAuth';
import useStageSelector from '../lib/digitalstage/useStageSelector';
import PageWrapperWithStage from '../components/new/elements/PageWrapperWithStage';
import StagePane from '../components/new/panes/StagePane';
import StageListView from '../components/new/elements/StageList';
import StageDeviceController from '../components/StageDeviceController';
import StageLeaver from '../components/StageLeaver';
import Layout from '../components/Layout';
import Container from '../components/Container';
import PageSpinner from '../components/PageSpinner';
import FixedAudioPlaybackStarterButton from '../components/new/elements/Menu/FixedAudioPlaybackStarterButton';

const Index = () => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);

  if (!loading) {
    if (!user) {
      router.push('/account/welcome');
    } else {
      return (
        <React.Fragment>
          {stageId ? (
            <React.Fragment>
              <PageWrapperWithStage>
                <StagePane />
              </PageWrapperWithStage>
              <StageDeviceController />
              <FixedAudioPlaybackStarterButton />
              <StageLeaver />
            </React.Fragment>
          ) : (
            <Layout>
              <Container size="stage">
                <Heading as="h1">Meine Bühnen</Heading>
                <StageListView />
              </Container>
            </Layout>
          )}
        </React.Fragment>
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
