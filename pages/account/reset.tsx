/** @jsx jsx */
import { useRouter } from 'next/router';
import * as React from 'react';
import { jsx, Heading } from 'theme-ui';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Loading from '../../components/new/elements/Loading';
import ResetPasswordForm from '../../components/authForms/ResetPasswordForm';
import Layout from '../../components/Layout';

const Reset = () => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const { token } = router.query;

  if (!loading) {
    if (user) {
      router.push('/');
    } else {
      return (
        <Layout>
          {token && !Array.isArray(token) && (
            <ResetPasswordForm resetToken={token} />
          )}
        </Layout>
      );
    }
  }

  return (
    <Loading>
      <Heading variant="h1">Lade ...</Heading>
    </Loading>
  );
};

export default Reset;
