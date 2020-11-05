import { useRouter } from 'next/router';
import React from 'react';
import { Typography } from '@material-ui/core';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Loading from '../../components/complex/depreacted/theme/Loading';
import ResetPassword from '../../components/digital-stage-sign-in/ResetPassword';
import PageWrapper from '../../components/new/elements/PageWrapper';

const Reset = () => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const { token } = router.query;

  if (!loading) {
    if (user) {
      router.push('/');
    } else {
      return (
      // <Container>
      //     <HeadingLarge>Passwort zurücksetzen</HeadingLarge>
        <PageWrapper>
          {token && !Array.isArray(token) && (
          // <ResetForm resetToken={token}/>
          <ResetPassword resetToken={token} targetUrl="/account/login" />
          )}
        </PageWrapper>
      // </Container>
      );
    }
  }

  return <Loading><Typography variant="h1">Lade...</Typography></Loading>;
};

export default Reset;
