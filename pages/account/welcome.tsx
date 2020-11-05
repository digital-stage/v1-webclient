import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Welcome from '../../components/digital-stage-sign-in/Welcome';
import PageWrapper from '../../components/new/elements/PageWrapper';

const WelcomeScreen = () => {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    router.prefetch('/account/signup');
    router.prefetch('/account/signin');
    router.prefetch('/account/forgot');
  }, []);

  if (!loading) {
    if (user) {
      router.push('/');
    }
  }

  return <PageWrapper><Welcome /></PageWrapper>;
};
export default WelcomeScreen;
