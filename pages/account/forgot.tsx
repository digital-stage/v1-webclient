import * as React from 'react';
import ForgetPasswordForm from '../../components/account/forms/ForgetPasswordForm';
import AuthPanel from '../../components/account/AuthPanel';
import AuthLayout from '../../components/layout/AuthLayout';

const Forgot = (): JSX.Element => {
  return (
    <AuthPanel>
      <ForgetPasswordForm />
    </AuthPanel>
  );
};
Forgot.Layout = AuthLayout;

export default Forgot;
