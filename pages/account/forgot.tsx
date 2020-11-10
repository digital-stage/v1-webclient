import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Layout from '../../components/Layout';
import AuthPageContainer from '../../components/AuthPageContainer';
import ForgetPasswordForm from '../../components/authForms/ForgetPasswordForm';

const SignUp = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push('/');
  }

  return (
    <Layout>
      <AuthPageContainer>
        <ForgetPasswordForm />
      </AuthPageContainer>
    </Layout>
  );
};

export default SignUp;
