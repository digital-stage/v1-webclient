/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { useRouter } from 'next/router';
import { jsx, Message } from 'theme-ui';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Layout from '../../components/Layout';
import AuthPageContainer from '../../components/AuthPageContainer';
import ResetPasswordForm from '../../components/authForms/ResetPasswordForm';

const Reset = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();
  const { token } = router.query;
  const [msg, setMsg] = React.useState({ state: false, type: null, kids: null });

  if (user) {
    router.push('/');
  }

  React.useEffect(() => {
    if (typeof token !== 'string') {
      setMsg({
        state: true,
        type: 'danger',
        kids:
          'Der genutzte Link ist nicht korrekt. Bitte prüfe Deine E-Mail für das Zurücksetzen des Passworts',
      });
    }
  }, []);

  return (
    <Layout auth>
      <AuthPageContainer>
        {msg.state && <Message variant={msg.type}>{msg.kids}</Message>}
        <ResetPasswordForm resetToken={token} />
      </AuthPageContainer>
    </Layout>
  );
};

export default Reset;
