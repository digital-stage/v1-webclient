import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/useAuth';
import AuthNavigation from '../../components/account/AuthNavigation';
import SignInForm from '../../components/account/forms/SignInForm';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthPanel from '../../components/account/AuthPanel';

const Login = (): JSX.Element => {
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
    <AuthPanel>
      <AuthNavigation />
      <SignInForm />
    </AuthPanel>
  );
};

Login.Layout = AuthLayout;

export default Login;
