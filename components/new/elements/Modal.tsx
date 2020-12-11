/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { Box, jsx, Close } from 'theme-ui';

interface Props {
  onClose(): void;
  isOpen: boolean;
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  type?: 'default' | 'settings';
}

const Modal = (props: Props): JSX.Element =>
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
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          bg: props.variant === 'dark' ? 'gray.4' : 'text',
          padding: 3,
          pl: props.type === 'settings' ? 0 : 3,
          width:
            props.type === 'settings'
              ? ['container.tiny', 'container.small', 'container.stage', 'container.default']
              : 'container.tiny',
          // TODO: @htw @timonela discuss if a fixed height is necessary here
          //height: props.type === 'settings' ? 'calc(100vh - 150px)' : 'auto',
          top: '50%',
          left: '50%',
          boxShadow: '0px 3px 6px #000000BC',
          borderRadius: '18px',
          transform: 'translate(-50%,-50%)',
          transition: 'all .6s ease-in-out',
        }}
      >
        <Box
          sx={{
            color: 'background',
            textAlign: 'right',
            pt: 2,
          }}
        >
          <Close onClick={props.onClose} sx={{ color: props.variant === 'dark' && 'text' }} />
        </Box>
        <main>{props.children}</main>
      </Box>
    </Box>
  ) : null;

export default Modal;
