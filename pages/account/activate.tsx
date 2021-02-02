import { useRouter } from 'next/router';
import React from 'react';
import ActivationForm from '../../components/account/forms/ActivationForm';
import AuthPanel from '../../components/account/AuthPanel';
import AuthLayout from '../../components/layout/AuthLayout';

const Activate = (): JSX.Element => {
  const { query } = useRouter();

  const initialCode = Array.isArray(query.code) ? query.code[0] : query.code;

  return (
    <AuthPanel>
      <ActivationForm initialCode={initialCode} />
    </AuthPanel>
  );
};

Activate.Layout = AuthLayout;

export default Activate;
