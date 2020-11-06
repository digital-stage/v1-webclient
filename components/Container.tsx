/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

enum Type {
  default = 'default',
  flex = 'flex',
  wide = 'wide',
}

const Container = (props: {
  children: React.ReactNode;
  type?: Type | Type.default;
}) => {
  const { children, type } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: type !== 'flex' ? 'column' : 'row',
        width: type !== 'flex' && '100%',
        maxWidth:
          type === 'default'
            ? 'container.default'
            : type === 'wide' && 'container.wide',
        mt: type === 'flex' && 4,
        mx: 'auto',
        px: 4, // px: '16px',
        justifyContent: type === 'flex' && 'space-around',
      }}
    >
      {children}
    </Box>
  );
};
export default Container;
