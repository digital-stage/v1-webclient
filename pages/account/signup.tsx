import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/useAuth';
import AuthNavigation from '../../components/auth/AuthNavigation';
import SignUpForm from '../../components/auth/forms/SignUpForm';
import AuthLayout from '../../digitalstage-ui/layout/AuthLayout';
import AuthPanel from '../../components/auth/AuthPanel';

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
    <AuthLayout>
      <AuthPanel>
        <AuthNavigation />
        <SignUpForm />
      </AuthPanel>
    </AuthLayout>
  );
};

export default SignUp;
