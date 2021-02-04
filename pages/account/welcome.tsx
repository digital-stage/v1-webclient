/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { jsx, Button, Flex, Heading, Text } from 'theme-ui';
import { useAuth } from '../../lib/useAuth';
import Logo from '../../digitalstage-ui/extra/Logo';
import { useIntl } from 'react-intl';

const Welcome = (): JSX.Element => {
  const router = useRouter();
  const { user } = useAuth();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  if (user) {
    router.push('/');
  }

  return (
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
          {f('projectDescription')}
        </Heading>
      </Flex>
      <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Heading as="h1" my={3}>
          {f('welcome')}
        </Heading>

        <Link href="/account/login">
          <Button variant="white" as="a">
            {f('start')}
          </Button>
        </Link>

        <Text sx={{ my: 2, textAlign: 'center' }}>{f('welcomeSubline')}</Text>
      </Flex>

      <Text variant="hint">Version 0.1</Text>
    </Flex>
  );
};

export default Welcome;
