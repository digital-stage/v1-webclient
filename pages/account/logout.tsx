import React, { useEffect, useState } from 'react';
import { DisplayMedium, HeadingLarge } from 'baseui/typography';
import { useRouter } from 'next/router';
import Container from '../../components/complex/depreacted/theme/layout/Container';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Loading from '../../components/complex/depreacted/theme/Loading';
import PageWrapper from '../layout/PageWrapper';

const Logout = () => {
  const router = useRouter();
  const [loggedOut, setLoggedOut] = useState<boolean>(false);
  const { logout, loading } = useAuth();

  useEffect(() => {
    logout()
      .then(() => {
        setLoggedOut(true);
        router.push('/account/login');
      });
  }, []);

  if (!loading) {
    if (loggedOut) {
      return (
        <PageWrapper>
          <Container>
            <HeadingLarge>Abgemeldet!</HeadingLarge>
          </Container>
        </PageWrapper>
      );
    }
  }
  return (
    <Loading>
      <DisplayMedium>Melde ab...</DisplayMedium>
    </Loading>
  );
};
export default Logout;
