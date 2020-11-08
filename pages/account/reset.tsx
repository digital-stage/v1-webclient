import { useRouter } from 'next/router';
import React from 'react';
import { Display, H1, HeadingLarge } from 'baseui/typography';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Loading from '../../components/new/elements/Loading';
import PageWrapper from '../../components/new/elements/PageWrapper';
import ResetPasswordForm from '../../components/new/forms/ResetPasswordForm';
import Container from '../../components/new/elements/Container';

const Reset = () => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const { token } = router.query;

  if (!loading) {
    if (user) {
      router.push('/');
    } else {
      return (
        <PageWrapper>
          <Container>
            <H1>Passwort zurücksetzen</H1>
            {token && !Array.isArray(token) && (
            <ResetPasswordForm resetToken={token} targetUrl="/account/login" />
            )}
          </Container>
        </PageWrapper>
      );
    }
  }

  return <Loading><Display>Lade...</Display></Loading>;
};

export default Reset;
