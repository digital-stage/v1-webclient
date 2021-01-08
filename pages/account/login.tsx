import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/useAuth';
import AuthNavigation from '../../components/auth/AuthNavigation';
import SignInForm from '../../components/auth/forms/SignInForm';
import AuthLayout from '../../digitalstage-ui/layout/AuthLayout';
import AuthPanel from '../../components/auth/AuthPanel';

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
    <AuthLayout>
      <AuthPanel>
        <AuthNavigation />
        <SignInForm />
      </AuthPanel>
    </AuthLayout>
  );
};
export default LoginScreen;
