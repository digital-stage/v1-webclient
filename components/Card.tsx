/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

enum Size {
  default = 'default',
  auth = 'auth',
}

const Card = (props: {
  children: React.ReactNode;
  size?: string | Size.default;
}) => {
  const { children, size } = props;

  return (
    <Box
      sx={{
        bg: 'background',
        boxShadow: 'default',
        width: '90vw',
        maxWidth: size === 'auth' && 'container.tiny',
        borderRadius: '18px',
        py: 3,
        px: 4,
        my: 4,
        mx: 'auto',
      }}
    >
      {children}
    </Box>
  );
};

export default Card;
