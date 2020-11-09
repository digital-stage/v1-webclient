import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import AuthPageContainer from '../../components/AuthPageContainer';
import AuthPageLinks from '../../components/AuthPageLinks';
import SignInForm from '../../components/authForms/SignInForm';
import Layout from '../../components/Layout';

const LoginScreen = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    router.prefetch('/account/signup');
    router.prefetch('/account/forgot');
  }, []);

  if (user) {
    router.push('/');
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
