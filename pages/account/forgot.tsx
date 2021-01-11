import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/useAuth';
import ForgetPasswordForm from '../../components/auth/forms/ForgetPasswordForm';
import AuthPanel from '../../components/auth/AuthPanel';
import AuthLayout from '../../components/global/layout/AuthLayout';

const SignUp = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push('/');
  }

  return (
    <AuthLayout>
      <AuthPanel>
        <ForgetPasswordForm />
      </AuthPanel>
    </AuthLayout>
  );
};

export default SignUp;
