import React, { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Close } from 'theme-ui';

const ModalHeader = () => {
  return <Box></Box>;
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
const ModalFooter = () => {
  return <Box></Box>;
};

interface ModalDimension {
  width?: string;
  height?: string;
  maxHeight?: string;
  maxWidth?: string;
  marginTop?: string;
  '@media screen and (min-width: 1200px)'?: {
    marginTop?: string;
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
  };
}

const calculateDimensions = (size?: 'auto' | 'default' | 'full'): ModalDimension => {
  if (size) {
    if (size === 'auto') {
      return {};
    } else if (size === 'full') {
      return {
        width: '100%',
        height: '100%',
      };
    }
  }
  return {
    width: '600px',
    maxWidth: '80vw',
    maxHeight: '80vh',
    marginTop: '10vh',
    '@media screen and (min-width: 1200px)': {
      width: '800px',
    },
  };
};

const Modal = (props: {
  children: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  closeOnBackdropClicked?: boolean;
  size?: 'auto' | 'default' | 'full';
}): JSX.Element => {
  const { size, open, children, onClose, closeOnBackdropClicked } = props;
  const [dimension, setDimension] = useState<ModalDimension>();

  useEffect(() => {
    setDimension(calculateDimensions(size));
  }, [size]);

  const handleCloseIconClick = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClicked && onClose) {
      onClose();
    }
  }, [closeOnBackdropClicked, onClose]);

  if (open) {
    return (
      <Flex
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: '100vw',
          height: '100vh',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            bg: 'backdropBg',
            zIndex: -1,
          }}
          onClick={handleBackdropClick}
        />
        <Box
          sx={{
            position: 'relative',
            bg: 'modalBg',
            borderRadius: '18px',
            boxShadow: 'default',
            ...dimension,
          }}
        >
          {children}

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
            onClick={handleCloseIconClick}
          >
            <Close />
          </Box>
        </Box>
      </Flex>
    );
  }

  return null;
};

export { ModalHeader, ModalBody, ModalFooter };
export default Modal;
