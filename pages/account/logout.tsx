/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Heading } from 'theme-ui';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Layout from '../../components/Layout';
import Container from '../../components/Container';

const Logout = (): JSX.Element => {
  const router = useRouter();
  const [loggedOut, setLoggedOut] = React.useState<boolean>(false);
  const { logout } = useAuth();

  React.useEffect(() => {
    logout().then(() => {
      setLoggedOut(true);
      router.push('/account/login');
    });
  }, []);

  return (
    loggedOut && (
      <Layout auth>
        <Container>
          <Heading>Abgemeldet!</Heading>
        </Container>
      </Layout>
    )
  );
};

export default Logout;
