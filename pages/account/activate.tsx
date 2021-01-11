import { useRouter } from 'next/router';
import React from 'react';
import ActivationForm from '../../components/auth/forms/ActivationForm';
import AuthLayout from '../../components/global/layout/AuthLayout';
import AuthPanel from '../../components/auth/AuthPanel';

const Activate = (): JSX.Element => {
  const { query } = useRouter();

  const initialCode = Array.isArray(query.code) ? query.code[0] : query.code;

  return (
    <AuthLayout>
      <AuthPanel>
        <ActivationForm initialCode={initialCode} />
      </AuthPanel>
    </AuthLayout>
  );
};

export default Activate;
