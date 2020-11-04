import React from 'react';
import { useRouter } from 'next/router';
import { H1 } from 'baseui/typography';
import { useAuth } from '../../lib/digitalstage/useAuth';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import PageWrapperWithStage from './PageWrapperWithStage';
import StagePane from '../../components/panes/StagePane';
import StagesListPane from '../../components/panes/StagesListPane';
import Loading from '../../components/complex/depreacted/theme/Loading';
import LocalDeviceControl from '../../components/layouts/LocalDeviceControl';
import AudioPlaybackStarter from '../../components/elements/sticky/AudioPlaybackStarter';

const Layout = () => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);

  if (!loading) {
    if (!user) {
      // Forward to welcome page (with PageWrapper instead of PageWrapperWithStage)
      router.push('/account/welcome');
    } else {
      // On stage related pages (all except sign in handling) wrap with PagWrapperWithStage
      return (
        <>
          <PageWrapperWithStage>
            {stageId ? <StagePane /> : <StagesListPane />}
          </PageWrapperWithStage>
          <LocalDeviceControl />
          <AudioPlaybackStarter />
        </>
      );
    }
  }

  return (
    <Loading>
      <H1>Lade ...</H1>
    </Loading>
  );
};
export default Layout;
