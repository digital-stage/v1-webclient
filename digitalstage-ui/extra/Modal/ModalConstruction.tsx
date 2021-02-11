/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useRef } from 'react';
import { Box, Flex, jsx, SxStyleProp } from 'theme-ui';
import { Portal } from 'react-portal';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export interface ModalProps {
  closable?: boolean;
  open?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sx?: SxStyleProp;
  size?: 'auto' | 'dialog' | 'full';
}

const ModalConstruction = (props: ModalProps): JSX.Element => {
  const { children, open, onClose, closable, size, sx } = props;
  const modalRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (modalRef.current && open) {
      const element = modalRef.current;
      disableBodyScroll(element);
      return () => {
        enableBodyScroll(element);
      };
    }
  }, [modalRef, open]);

  if (open) {
    return (
      <Portal>
        <Flex
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'auto',
            zIndex: '9999',
            alignItems: 'flex-start',
          }}
        >
          <Flex
            onClick={() => {
              if (closable && onClose) onClose();
            }}
            sx={{
              minHeight: '100%',
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              bg: 'modalBg',
              p: size === 'full' ? 4 : 0,
            }}
          >
            <Box
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
              sx={{
                maxWidth: size
                  ? size === 'dialog'
                    ? 'container.tiny'
                    : ['container.tiny', 'container.small', 'container.stage', 'container.default']
                  : undefined,
                ...sx,
              }}
            >
              {children}
            </Box>
          </Flex>
        </Flex>
      </Portal>
    );
  }

  return null;
};
export default ModalConstruction;
