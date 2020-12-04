/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { jsx, Message } from 'theme-ui';
import ResetPasswordForm from '../../components/authForms/ResetPasswordForm';
import AuthPageContainer from '../../components/AuthPageContainer';
import Layout from '../../components/Layout';
import { useAuth } from '../../lib/useAuth';

const Reset = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();
  const { token } = router.query;
  // router.query requires this step because we need to ensure a string and not an array for further handling!
  const singleToken = Array.isArray(token) ? token[0] : token;

  const [msg, setMsg] = useState({ state: false, type: null, kids: null });

  if (user) {
    router.push('/');
  }

  useEffect(() => {
    router.asPath.includes('token=') ||
      setMsg({
        state: true,
        type: 'danger',
        kids:
          'Der genutzte Link ist nicht korrekt. Bitte prüfe Deine E-Mail für das Zurücksetzen des Passworts',
      });
  }, [router]);

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
