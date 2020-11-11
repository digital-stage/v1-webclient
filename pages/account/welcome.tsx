import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { styled } from 'baseui';
import {
  Caption1, DisplaySmall, LabelLarge,
} from 'baseui/typography';
import Link from 'next/link';
import { useAuth } from '../../lib/digitalstage/useAuth';
import PageWrapper from '../../components/new/elements/PageWrapper';
import Container from '../../components/new/elements/Container';
import {Button} from "baseui/button";

const Wrapper = styled('div', {
  minHeight: '100vh',
  display: 'flex',
  padding: '1rem',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Header = styled('div', {
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});
const Logo = styled('img', {
  width: '80px',
});

const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '400px',
});

const Footer = styled('div', {

  maxWidth: '400px',
});

const WelcomeScreen = () => {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    router.prefetch('/account/signup');
    router.prefetch('/account/signin');
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
            <Logo alt="Digital Stage" src="/static/images/white_logo.png" />
            <LabelLarge
              $style={{
                textAlign: 'center',
              }}
              margin={0}
              color="white"
            >
              Your digital stage for art, music
              and theatre ensembles.
            </LabelLarge>
          </Header>
          <Content>
            <DisplaySmall paddingBottom="2rem" paddingTop="1rem" color="white">Willkommen zurück</DisplaySmall>
            <Link href="/account/login">
              <Button kind="secondary">
                Anmelden
              </Button>
            </Link>
            <Caption1 color="white">Melde Dich an oder erstelle einen neuen Account</Caption1>
          </Content>
          <Footer>
            <Caption1 color="white">Version 0.0001</Caption1>
          </Footer>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
};
export default WelcomeScreen;
