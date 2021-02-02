import ResendActivationForm from '../../components/account/forms/ResendActivationForm';
import React from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthPanel from '../../components/account/AuthPanel';

const Reactivate = (): JSX.Element => {
  return (
    <AuthPanel>
      <ResendActivationForm />
    </AuthPanel>
  );
};
Reactivate.Layout = AuthLayout;
export default Reactivate;
