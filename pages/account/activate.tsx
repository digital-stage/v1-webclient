import { useRouter } from 'next/router';
import React from 'react';
import ActivationForm from '../../components/authForms/ActivationForm';
import Layout from '../../components/Layout';
import AuthPageContainer from '../../components/AuthPageContainer';

const Activate = (): JSX.Element => {
  const { query } = useRouter();

  const initialCode = Array.isArray(query.code) ? query.code[0] : query.code;

  return (
    <Layout auth>
      <AuthPageContainer>
        <ActivationForm initialCode={initialCode} />
      </AuthPageContainer>
    </Layout>
  );
};

export default Activate;
