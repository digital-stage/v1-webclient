/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { MdClose } from 'react-icons/md';

interface Props {
  onClose(): any;
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal = (props: Props) =>
  props.isOpen ? (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bg: 'modalBg',
        transition: 'background 6s ease-in-out',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          background: 'white',
          padding: 3,
          width: '332px',
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
          <span onClick={props.onClose} style={{ cursor: 'pointer' }}>
            <MdClose />
          </span>
        </Box>
        <main>{props.children}</main>
      </Box>
    </Box>
  ) : null;

export default Modal;
