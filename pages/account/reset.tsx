/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { useRouter } from 'next/router';
import { jsx, Message } from 'theme-ui';
import { useAuth } from '../../lib/useAuth';
import Layout from '../../components/Layout';
import AuthPageContainer from '../../components/AuthPageContainer';
import ResetPasswordForm from '../../components/authForms/ResetPasswordForm';

const Reset = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();
  const { token } = router.query;
  // router.query requires this step because we need to ensure a string and not an array for further handling!
  const singleToken = Array.isArray(token) ? token[0] : token;

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
    } else {
      setMsg({
        state: false,
        type: null,
        kids: null,
      });
    }
  }, [token]);

  return (
    <Layout auth>
      <AuthPageContainer>
        {msg.state && <Message variant={msg.type}>{msg.kids}</Message>}
        <ResetPasswordForm resetToken={singleToken} />
      </AuthPageContainer>
    </Layout>
  );
};

export default Reset;
