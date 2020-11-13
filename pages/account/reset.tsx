/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {useRouter} from 'next/router';
import {jsx} from 'theme-ui';
import {useAuth} from '../../lib/digitalstage/useAuth';
import Layout from '../../components/Layout';
import AuthPageContainer from '../../components/AuthPageContainer';
import ResetPasswordForm from '../../components/authForms/ResetPasswordForm';

const Reset = (): JSX.Element => {
  const router = useRouter();
  const {user} = useAuth();
  const {token} = router.query;

  if (user) {
    router.push('/');
  }

  if (typeof token !== "string") {
    // TODO: Handle invalid token
    return (
      <div>
        TODO: Show error
      </div>
    )
  }

  return (
    <Layout auth>
      <AuthPageContainer>
        <ResetPasswordForm resetToken={token}/>
      </AuthPageContainer>
    </Layout>
  );
};

export default Reset;
