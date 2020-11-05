/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

const Layout = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return (
    <Box
      sx={{
        background:
          'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
        minHeight: '100vh',
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;
