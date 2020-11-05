/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

const Layout = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return (
    <Box
      sx={{
        bg: 'dsbackground',
        minHeight: '100vh',
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;
