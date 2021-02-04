/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Spinner } from 'theme-ui';

const LoadingOverlay = (props: { children?: React.ReactNode }): JSX.Element => (
  <Flex
    sx={{
      position: 'fixed',
      top: 0,
      right: 0,
      backgroundColor: 'hsla(0, 0%, 11%, 0.4)',
      height: '100vh',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <Spinner sx={{ color: 'text' }} />
    {props.children}
  </Flex>
);

export default LoadingOverlay;
