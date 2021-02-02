/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { Flex } from '@theme-ui/components';
import { Box, Heading, jsx, Link } from 'theme-ui';
import Logo from '../../../digitalstage-ui/elements/Logo';

const SideBarItem = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  return (
    <Flex
      role="presentation"
      sx={{
        outline: 'none',
        textAlign: 'center',
        py: 3,
        cursor: 'pointer',
      }}
    >
      <Heading variant="body" sx={{ color: 'text' }}>
        {children}
      </Heading>
    </Flex>
  );
};

const SideBar = (): JSX.Element => {
  return (
    <Flex
      role="menu"
      py={5}
      sx={{
        flexDirection: 'column',
        bg: 'gray.7',
        minHeight: '100vh',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexGrow: 0,
      }}
    >
      <Box>
        <Link
          sx={{
            color: 'text',
          }}
          href="https://www.digital-stage.org"
          target="_blank"
        >
          <Logo full={false} width={30} />
        </Link>
      </Box>
      <Flex>Center</Flex>
      <Flex>Bottom</Flex>
    </Flex>
  );
};
export default SideBar;
