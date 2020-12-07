import ResendActivationForm from '../../components/authForms/ResendActivationForm';
import React from 'react';
import Layout from '../../components/Layout';
import AuthPageContainer from '../../components/AuthPageContainer';

const Reactivate = (): JSX.Element => {
  return (
    <Layout auth>
      <AuthPageContainer>
        <ResendActivationForm />
      </AuthPageContainer>
    </Layout>
  );
};
export default Reactivate;
