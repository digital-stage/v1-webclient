/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { useRouter } from 'next/router';
import { jsx, Heading } from 'theme-ui';
import { useAuth } from '../lib/digitalstage/useAuth';
import useStageSelector from '../lib/digitalstage/useStageSelector';
import StagePane from '../components/new/panes/StagePane';
import StageListView from '../components/new/elements/StageList';
import StageDeviceController from '../components/StageDeviceController';
import StageLeaver from '../components/StageLeaver';
import Layout from '../components/Layout';
import Container from '../components/Container';
import PageSpinner from '../components/PageSpinner';
import FixedAudioPlaybackStarterButton from '../components/new/elements/Menu/FixedAudioPlaybackStarterButton';

const Index = (): JSX.Element => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);

  if (!loading) {
    if (!user) {
      router.push('/account/welcome');
    } else {
      return (
        <Layout sidebar={!!stageId}>
          {stageId ? (
            <React.Fragment>
              <StagePane />

              <FixedAudioPlaybackStarterButton />
              <StageDeviceController />
              <StageLeaver />
            </React.Fragment>
          ) : (
            <Container size="stage">
              <Heading as="h1" sx={{ ml: 3, mt: [4, 5] }}>
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
