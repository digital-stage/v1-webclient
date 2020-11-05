import { useRouter } from 'next/router';
import React from 'react';
import { Typography } from '@material-ui/core';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Loading from '../../components/new/elements/Loading';
import ResetPassword from '../../components/digital-stage-sign-in/ResetPassword';
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
            <ResetPassword resetToken={token} targetUrl="/account/login" />
          )}
        </Layout>
      );
    }
  }

  return (
    <Loading>
      <Typography variant="h1">Lade...</Typography>
    </Loading>
  );
};

export default Reset;
