import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Login from '../../components/digital-stage-sign-in';
import Loading from '../../components/complex/depreacted/theme/Loading';
import PageWrapper from '../../components/new/PageWrapper';

const SignUp = () => {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    router.prefetch('/account/login');
  }, []);

  if (!loading) {
    if (user) {
      router.push('/');
    }
  } else {
    return <Loading>Sign up</Loading>;
  }

  return (
    <PageWrapper>
      <Login mode="signup" />
    </PageWrapper>
  );
};
export default SignUp;
