/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { jsx, Button, Flex, Heading, Text } from 'theme-ui';
import DigitalStageLogo from '../../components/DigitalStageLogo';
import { useAuth } from '../../lib/useAuth';
import Layout from '../../components/Layout';
import Logo from '../../digitalstage-ui/elements/Logo';
import { WhiteButton } from '../../digitalstage-ui/elements/input/Button';

const Welcome = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push('/');
  }

  return (
    <Layout auth>
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100vh',
          px: 10,
          py: 4,
        }}
      >
        <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
          <Logo width={80} />

          <Heading as="h3" m={3}>
            Deine digitale Bühne für Kunst-, <br />
            Musik- und Theaterensembles
          </Heading>
        </Flex>
        <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
          <Heading as="h1" my={3}>
            Herzlich willkommen
          </Heading>

          <Link href="/account/login">
            <WhiteButton as="a">Starten</WhiteButton>
          </Link>

          <Text sx={{ my: 2, textAlign: 'center' }}>
            Melde Dich mit Deinem Account an
            <br />
            oder erstelle einen neuen
          </Text>
        </Flex>

        <Text variant="hint">Version 0.1</Text>
      </Flex>
    </Layout>
  );
};

export default Welcome;
