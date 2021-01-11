/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Link, Flex } from 'theme-ui';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

const SettingsNavigation = (): JSX.Element => {
  const { pathname } = useRouter();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <Flex sx={{ justifyContent: 'center' }}>
      <NextLink href="/settings/profile">
        <Link
          variant="auth"
          sx={{
            borderBottomColor: pathname === '/settings/profile' && 'secondary',
            width: '50%',
            textAlign: 'center',
          }}
        >
          {f('profile')}
        </Link>
      </NextLink>
      <NextLink href="/settings/devices">
        <Link
          variant="auth"
          sx={{
            borderBottomColor: pathname === '/settings/devices' && 'secondary',
            width: '50%',
            textAlign: 'center',
          }}
        >
          {f('devices')}
        </Link>
      </NextLink>
    </Flex>
  );
};

export default SettingsNavigation;
