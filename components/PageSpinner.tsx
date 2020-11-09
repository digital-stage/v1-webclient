/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Spinner } from 'theme-ui';

const PageSpinner = () => (

  <Flex
    sx={{
      position: 'fixed',
      top: 0,
      right: 0,
      bg: 'hsla(0, 0%, 11%, 0.4)',
      height: '100vh',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Spinner sx={{ color: 'text' }} />
  </Flex>

);

export default PageSpinner;
