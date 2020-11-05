import React, { useEffect, useState } from 'react';
import { DisplayMedium, HeadingLarge } from 'baseui/typography';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Loading from '../../components/new/elements/Loading';
import Layout from '../../components/Layout';
import Container from '../../components/Container';

const Logout = () => {
  const router = useRouter();
  const [loggedOut, setLoggedOut] = useState<boolean>(false);
  const { logout, loading } = useAuth();

  useEffect(() => {
    logout().then(() => {
      setLoggedOut(true);
      router.push('/account/login');
    });
  }, []);

  if (!loading) {
    if (loggedOut) {
      return (
        <Layout>
          <Container>
            <HeadingLarge>Abgemeldet!</HeadingLarge>
          </Container>
        </Layout>
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
