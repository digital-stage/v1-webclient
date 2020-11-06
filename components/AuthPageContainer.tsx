/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import Card from './Card';

const AuthPageContainer = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        px: 3,
        py: 4,
      }}
    >
      <Box
        sx={{
          mb: [4, null, 5],
        }}
      >
        <img
          src="/images/welcome_icon.png"
          width="180"
          height="auto"
          alt="logo"
        />
      </Box>
      <Card size="auth">{children}</Card>
    </Flex>
  );
};

export default AuthPageContainer;
