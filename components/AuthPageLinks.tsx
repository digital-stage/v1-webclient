/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Link, Flex } from 'theme-ui';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  {
    label: 'Sign In',
    uri: '/account/login',
  },
  {
    label: 'Sign Up',
    uri: '/account/signup',
  },
];

const AuthPageLinks = (): JSX.Element => {
  const { pathname } = useRouter();

  return (
    <Flex sx={{ justifyContent: 'space-between' }}>
      {navItems.map((item, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <NextLink key={idx} href={item.uri}>
          <Link
            variant="auth"
            href={item.uri}
            sx={{
              borderBottomColor: pathname === item.uri && 'primary',
            }}
          >
            {item.label}
          </Link>
        </NextLink>
      ))}
    </Flex>
  );
};

export default AuthPageLinks;
