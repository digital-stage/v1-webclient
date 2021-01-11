import ResendActivationForm from '../../components/auth/forms/ResendActivationForm';
import React from 'react';
import AuthLayout from '../../components/global/layout/AuthLayout';
import AuthPanel from '../../components/auth/AuthPanel';

const Reactivate = (): JSX.Element => {
  return (
    <AuthLayout>
      <AuthPanel>
        <ResendActivationForm />
      </AuthPanel>
    </AuthLayout>
  );
};
export default Reactivate;
