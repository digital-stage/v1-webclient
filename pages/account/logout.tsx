/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { Heading, jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthPanel from '../../components/account/AuthPanel';
import LoadingOverlay from '../../components/global/LoadingOverlay';
import { useIntl } from 'react-intl';

const Logout = (): JSX.Element => {
  const router = useRouter();
  const [loggedOut, setLoggedOut] = React.useState<boolean>(false);
  const { logout } = useAuth();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  React.useEffect(() => {
    logout().then(() => {
      setLoggedOut(true);
      router.push('/account/login');
    });
  }, []);

  if (loggedOut) {
    return (
      <AuthPanel>
        <Heading>{f('signedOut')}</Heading>
      </AuthPanel>
    );
  }

  return (
    <LoadingOverlay>
      <Heading>{f('signingOut')}</Heading>
    </LoadingOverlay>
  );
};

Logout.Layout = AuthLayout;

export default Logout;
