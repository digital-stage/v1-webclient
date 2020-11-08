import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Loading from '../../components/new/elements/Loading';
import PageWrapper from '../../components/new/elements/PageWrapper';
import SignUpForm from '../../components/new/forms/SignUpForm';

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
      <SignUpForm />
    </PageWrapper>
  );
};
export default SignUp;
