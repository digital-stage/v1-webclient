/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { Box, Flex, jsx } from 'theme-ui';

const Loading = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <Flex
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#FFFFFF',

      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}
  >
    <Box
      sx={{ animationDuration: '1s', animationIterationCount: 'infinite', animationName: 'bounce' }}
    >
      {children}
    </Box>
  </Flex>
);

export default Loading;
