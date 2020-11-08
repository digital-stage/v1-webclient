/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import Card from './Card';

const Modal = (props: { children: React.ReactNode; onClick }) => {
  const { children, onClick } = props;
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        minHeight: '100hv',
        minWidth: '100%',
        bg: 'hsla(100, 100, 50, 0.5)'
      }}
      onClick={onClick}
    >
      <Card>
        Bert
        {children}
      </Card>
    </Box>
  );
};

export default Modal;
