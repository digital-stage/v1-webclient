import React from 'react';
import { useRouter } from 'next/router';
import { H1 } from 'baseui/typography';
import { useAuth } from '../lib/digitalstage/useAuth';
import Loading from '../components/complex/depreacted/theme/Loading';
import useStageSelector from '../lib/digitalstage/useStageSelector';
import PageWrapperWithStage from '../components/new/PageWrapperWithStage';
import StagePane from '../components/new/panes/StagePane';
import StagesListPane from '../components/new/panes/StagesListPane';
import LocalDeviceControl from '../components/layouts/LocalDeviceControl';
import AudioPlaybackStarter from '../components/new/Menu/AudioPlaybackStarter';
import FixedLeaveButton from '../components/new/Menu/FixedLeaveButton';
import PageWrapper from '../components/new/PageWrapper';
import Container from '../components/new/Container';

const Layout = () => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);

  if (!loading) {
    if (!user) {
      // Forward to welcome page (with PageWrapper instead of PageWrapperWithStage)<
      router.push('/account/welcome');
    } else {
      // On stage related pages (all except sign in handling) wrap with PagWrapperWithStage
      return (
        <>
          {stageId ? (
            <PageWrapperWithStage>
              <StagePane />
            </PageWrapperWithStage>
          ) : (
            <PageWrapper>
              <Container>
                <StagesListPane />
              </Container>
            </PageWrapper>
          )}
          <LocalDeviceControl />
          <AudioPlaybackStarter />
          <FixedLeaveButton />
        </>
      );
    }
  }

  return (
    <Loading>
      <H1>Neues Layout im Anmarsch!</H1>
    </Loading>
  );
};
export default Layout;
