import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/useAuth';
import Layout from '../../components/Layout';
import AuthPageContainer from '../../components/AuthPageContainer';
import AuthPageLinks from '../../components/AuthPageLinks';
import SignUpForm from '../../components/authForms/SignUpForm';

const SignUp = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    router.prefetch('/account/login');
    router.prefetch('/account/forgot');
  }, []);

  if (user) {
    router.push('/');
  }

  return (
    <Layout auth>
      <AuthPageContainer>
        <AuthPageLinks />
        <SignUpForm />
      </AuthPageContainer>
    </Layout>
  );
};

export default SignUp;
