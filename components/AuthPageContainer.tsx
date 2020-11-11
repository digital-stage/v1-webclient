/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import Card from './Card';
import DigitalStageLogo from './DigitalStageLogo';

const AuthPageContainer = (props: { children: React.ReactNode }): JSX.Element => {
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
        <DigitalStageLogo single width={180} />
      </Box>
      <Card size="auth">{children}</Card>
    </Flex>
  );
};

export default AuthPageContainer;
