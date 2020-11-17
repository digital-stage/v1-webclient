/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box, IconButton } from 'theme-ui';
import { MdClose } from 'react-icons/md';

interface Props {
  onClose(): void;
  isOpen: boolean;
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  type?: 'default' | 'settings';
}

const Modal = (props: Props) =>
  props.isOpen ? (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bg: 'modalBg',
        transition: 'background 6s ease-in-out',
        zIndex: 99999,
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          bg: props.variant === 'dark' ? 'gray.4' : 'text',
          padding: 3,
          pl: props.type === 'settings' ? 0 : 3,
          width: props.type === 'settings' ? 'container.default' : 'container.tiny',
          height: 'auto',
          top: '50%',
          left: '50%',
          boxShadow: '0px 3px 6px #000000BC',
          borderRadius: '18px',
          transform: 'translate(-50%,-50%)',
          transition: 'all 6s ease-in-out',
        }}
      >
        <Box
          sx={{
            color: 'background',
            textAlign: 'right',
            pt: 2,
          }}
        >
          <IconButton onClick={props.onClose} style={{ cursor: 'pointer' }}>
            <MdClose sx={{ color: props.variant === 'dark' && 'text' }} />
          </IconButton>
        </Box>
        <main>{props.children}</main>
      </Box>
    </Box>
  ) : null;

export default Modal;
