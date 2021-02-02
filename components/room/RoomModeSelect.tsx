/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Link, Flex } from 'theme-ui';
import NextLink from 'next/link';
import { useIntl } from 'react-intl';

const RoomNavigation = (
    props: {
        global: boolean;
        onChange: (global: boolean) => void;
    }
): JSX.Element => {
    const {onNavigation} = props;
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

export default RoomNavigation;
