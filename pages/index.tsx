/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import * as React from 'react';
import { useAuth } from '../lib/useAuth';
import { useCurrentStageId } from '../lib/use-digital-stage/hooks';
import AuthLayout from '../components/layout/AuthLayout';
import { jsx } from 'theme-ui';
import LoadingOverlay from '../components/global/LoadingOverlay';
import useDigitalStage from '../lib/use-digital-stage';

const Index = (): JSX.Element => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const stageId = useCurrentStageId();
  const { ready } = useDigitalStage();

  if (!loading) {
    if (!user) {
      router.push('/account/welcome');
    } else if (ready) {
      if (stageId) {
        router.push('/stage');
      } else {
        router.push('/stages');
      }
    }
  }

  return <LoadingOverlay />;
};

export default Index;
