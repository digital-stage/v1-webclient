import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { styled } from 'baseui';
import Link from 'next/link';
import { useAuth } from '../../lib/digitalstage/useAuth';
import PageWrapper from '../../components/new/elements/PageWrapper';
import LoginForm from '../../components/new/forms/LoginForm';
import Container from '../../components/new/elements/Container';

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '2rem',
});
const Header = styled('div', {

});
const Logo = styled('img', {
  width: '100%',
  height: 'auto',
  maxWidth: '180px',
});
const Content = styled('div', ({ $theme }) => ({
  maxWidth: '400px',
  backgroundColor: $theme.colors.black,
  color: $theme.colors.white,
}));

const LoginScreen = () => {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    router.prefetch('/account/signup');
    router.prefetch('/account/forgot');
  }, []);

  if (!loading) {
    if (user) {
      router.push('/');
    }
  }

  return (
    <PageWrapper>
      <Container>
        <Wrapper>
          <Header>
            <Logo alt="Digital Stage" src="/static/images/white_logo_full.png" />
          </Header>
          <Content>
            <LoginForm />
            <Link href="/account/forgot">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>
                Passwort vergessen?
              </a>
            </Link>
          </Content>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
};
export default LoginScreen;
