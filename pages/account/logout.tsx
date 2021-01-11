/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Heading } from 'theme-ui';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/useAuth';
import AuthLayout from '../../components/global/layout/AuthLayout';
import Panel, { WhitePanel } from '../../digitalstage-ui/elements/surface/Panel';

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
      <AuthLayout>
        <Panel>
          <Heading>Abgemeldet!</Heading>
        </Panel>
      </AuthLayout>
    )
  );
};

export default Logout;
