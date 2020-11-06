import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Layout from '../../components/Layout';
import AuthPageContainer from '../../components/AuthPageContainer';
import AuthPageLinks from '../../components/AuthPageLinks';
import SignUpForm from '../../components/digital-stage-sign-in/SignUpForm';

const SignUp = () => {
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push('/');
  }

  return (
    <Layout>
      <AuthPageContainer>
        <AuthPageLinks />
        <SignUpForm />
      </AuthPageContainer>
    </Layout>
  );
};

export default SignUp;
