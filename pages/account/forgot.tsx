import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/useAuth';
import ForgetPasswordForm from '../../components/account/forms/ForgetPasswordForm';
import AuthPanel from '../../components/account/AuthPanel';
import AuthLayout from '../../components/layout/AuthLayout';

const Forgot = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push('/');
  }

  return (
    <AuthPanel>
      <ForgetPasswordForm />
    </AuthPanel>
  );
};
Forgot.Layout = AuthLayout;

export default Forgot;
