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
  maxWidth?: string;
  size?: string | Size.default;
  white?: boolean | false;
  mt?: number;
}): JSX.Element => {
  const { children, maxWidth, size, white, mt } = props;

  return (
    <Box
      sx={{
        bg: white ? 'text' : 'gray.7',
        boxShadow: 'default',
        width: '100%',
        maxWidth: size === 'auth' ? 'container.tiny' : maxWidth,
        borderRadius: 'card',
        py: 3,
        px: size === 'auth' ? [3, 4] : [3, 3],
        my: 4,
        mt: mt && mt,
        mx: 'auto',
      }}
    >
      {children}
    </Box>
  );
};

export default Card;
