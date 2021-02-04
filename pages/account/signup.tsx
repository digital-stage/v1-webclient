import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/useAuth';
import AuthNavigation from '../../components/account/AuthNavigation';
import SignUpForm from '../../components/account/forms/SignUpForm';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthPanel from '../../components/account/AuthPanel';

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
    <AuthPanel>
      <AuthNavigation />
      <SignUpForm />
    </AuthPanel>
  );
};

SignUp.Layout = AuthLayout;

export default SignUp;
