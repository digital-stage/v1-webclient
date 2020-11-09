/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { jsx, Button, Flex, Heading, Text } from 'theme-ui';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Layout from '../../components/Layout';

const Welcome = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push('/');
  }

  return (
    <Layout>
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
          <img src="/images/white_logo.png" width="80" height="auto" alt="logo" />

          <Heading as="h4" m={3}>
            Your digital stage for art, music
            <br />
            and theatre ensembles.
          </Heading>
        </Flex>
        <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
          <Heading as="h1" my={3}>
            Welcome back
          </Heading>

          <Link href="/account/login">
            <Button as="a" variant="white" href="/account/login">
              Sign In
            </Button>
          </Link>

          <Text sx={{ my: 2, textAlign: 'center' }}>
            Sign into account or
            <br />
            create a new one
          </Text>
        </Flex>

        <Text variant="hint">Version 0.00001</Text>
      </Flex>
    </Layout>
  );
};

export default Welcome;
