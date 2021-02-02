/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { Box, Close, jsx } from 'theme-ui';
import ModalConstruction, { ModalProps } from './ModalConstruction';

const ModalHeader = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  return <Box>{children}</Box>;
};
const ModalBody = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  return (
    <Box
      sx={{
        position: 'relative',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        height: '100%',
      }}
    >
      {children}
    </Box>
  );
};
const ModalFooter = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  return <Box>{children}</Box>;
};

const Modal = (props: ModalProps): JSX.Element => {
  const { open, onClose, closable, children } = props;

  return (
    <ModalConstruction open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'relative',
          boxShadow: 'default',
          padding: '1rem',
        }}
      >
        {children}
        {closable && (
          <Box
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              top: '6px',
              right: '6px',
              color: 'muted',
              '&:hover': {
                color: 'text',
              },
            }}
            onClick={onClose}
          >
            <Close />
          </Box>
        )}
      </Box>
    </ModalConstruction>
  );
};

export { ModalHeader, ModalBody, ModalFooter };
export default Modal;
