/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex, Spinner } from 'theme-ui';
import { useAuth } from '../lib/digitalstage/useAuth';

const Layout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const { loading } = useAuth();

  return (
    <Box
      sx={{
        background:
          'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
        minHeight: '100vh'
      }}
    >
      {loading ? (
        <Flex
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            bg: 'hsla(0, 0%, 11%, 0.4)',
            height: '100vh',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Spinner sx={{ color: 'text' }} />
        </Flex>
      ) : (
        children
      )}
    </Box>
  );
};

export default Layout;
