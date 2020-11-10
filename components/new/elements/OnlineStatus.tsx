/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';

const OnlineStatus = ({ online }: { online: boolean }): JSX.Element => (
  <Box
    sx={{
      display: 'inline-block',
      width: '0.75rem',
      height: '0.75rem',
      bg: online ? 'success' : 'danger',
      borderRadius: '50%',
    }}
  />
);

export default OnlineStatus;
