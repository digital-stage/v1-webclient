/** @jsxRuntime classic */
/** @jsx jsx */
import ModalConstruction, { ModalProps } from './Modal/ModalConstruction';
import React from 'react';
import { Box, Close, jsx } from 'theme-ui';

export type DialogProps = ModalProps;

const DarkDialog = (props: DialogProps): JSX.Element => {
  const { open, onClose, children, sx, closable } = props;

  return (
    <ModalConstruction closable={closable} open={open} onClose={onClose}>
      <Box
        sx={{
          bg: 'gray.4',
          p: 6,
          boxShadow: 'default',
          borderRadius: '18px',
          ...sx,
        }}
      >
        <Box
          sx={{
            color: 'background',
            textAlign: 'right',
            pt: 2,
          }}
        >
          <Close onClick={props.onClose} sx={{ color: 'text' }} />
        </Box>
        <main>{children}</main>
      </Box>
    </ModalConstruction>
  );
};

const LightDialog = (props: DialogProps): JSX.Element => {
  const { open, onClose, children, sx, size, closable } = props;

  return (
    <ModalConstruction closable={closable} open={open} onClose={onClose} size={size}>
      <Box
        sx={{
          bg: 'gray.0',
          p: 6,
          boxShadow: 'default',
          borderRadius: '18px',
          ...sx,
        }}
      >
        <Box
          sx={{
            color: 'background',
            textAlign: 'right',
            pt: 2,
          }}
        >
          <Close onClick={props.onClose} />
        </Box>
        <main>{children}</main>
      </Box>
    </ModalConstruction>
  );
};
export { LightDialog, DarkDialog };

export default DarkDialog;
