import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import AuthPageContainer from '../../components/AuthPageContainer';
import AuthPageLinks from '../../components/AuthPageLinks';
import SignInForm from '../../components/authForms/SignInForm';
import Layout from '../../components/Layout';

const LoginScreen = () => {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    router.prefetch('/account/signup');
    router.prefetch('/account/forgot');
  }, []);

  if (!loading) {
    if (user) {
      router.push('/');
    }
  }

  return (
    <Layout>
      <AuthPageContainer>
        <AuthPageLinks />
        <SignInForm />
      </AuthPageContainer>
    </Layout>
  );
};
export default LoginScreen;
