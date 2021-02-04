/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Link, Flex } from 'theme-ui';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

const AuthNavigation = (): JSX.Element => {
  const { pathname } = useRouter();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <Flex sx={{ justifyContent: 'center' }}>
      <NextLink href="/account/login">
        <Link
          variant="auth"
          sx={{
            borderBottomColor: pathname === '/account/login' && 'secondary',
            width: '50%',
            textAlign: 'center',
          }}
        >
          {f('login')}
        </Link>
      </NextLink>
      <NextLink href="/account/signup">
        <Link
          variant="auth"
          sx={{
            borderBottomColor: pathname === '/account/signup' && 'secondary',
            width: '50%',
            textAlign: 'center',
          }}
        >
          {f('signUp')}
        </Link>
      </NextLink>
    </Flex>
  );
};

export default AuthNavigation;
