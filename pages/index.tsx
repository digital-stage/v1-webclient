/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import * as React from 'react';
import { jsx } from 'theme-ui';
import Layout from '../components/Layout';
import PageSpinner from '../components/PageSpinner';
import { useAuth } from '../lib/useAuth';
import { useCurrentStageId } from '../lib/use-digital-stage/hooks';
import AuthLayout from '../components/global/layout/AuthLayout';

const Index = (): JSX.Element => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const stageId = useCurrentStageId();

  if (!loading) {
    if (!user) {
      router.push('/account/welcome');
    } else {
      if (stageId) {
        router.push('/stage');
      } else {
        router.push('/stages');
      }
    }
  }

  return (
    <AuthLayout>
      <PageSpinner />
    </AuthLayout>
  );
};

export default Index;
