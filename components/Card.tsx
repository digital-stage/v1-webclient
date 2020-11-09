/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

enum Size {
  default = 'default',
  auth = 'auth'
}

const Card = (props: {
  children: React.ReactNode;
  maxWidth?: string;
  size?: string | Size.default;
  white?: boolean | false;
}) => {
  const { children, maxWidth, size, white } = props;

  return (
    <Box
      sx={{
        bg: white ? 'text' : 'background',
        boxShadow: 'default',
        width: '100%',
        maxWidth: size === 'auth' ? 'container.tiny' : maxWidth,
        borderRadius: '18px',
        py: 3,
        px: 4,
        my: 4,
        mx: 'auto'
      }}
    >
      {children}
    </Box>
  );
};

export default Card;
