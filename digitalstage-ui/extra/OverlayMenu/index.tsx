/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, css, Flex, jsx } from 'theme-ui';
import { FaUser } from 'react-icons/fa';
import React, { useEffect, useRef } from 'react';
import { Interpolation } from '@emotion/serialize';
import { LightPanel } from '../Panel';
import PrimaryToggleButton from '../ToggleButton';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const OverlayMenu = (props: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  styles?: Interpolation;
  children: React.ReactNode | React.ReactNodeArray;
}): JSX.Element => {
  const { styles, children, open, onClose, onOpen } = props;
  const scrollRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      if (open) {
        disableBodyScroll(scrollRef.current);
      } else {
        enableBodyScroll(scrollRef.current);
      }
    }
  }, [scrollRef, open]);

  return (
    <Box
      sx={{
        position: 'relative',
      }}
      css={css(styles)}
    >
      <PrimaryToggleButton
        sx={{
          position: 'relative',
          width: '32px',
          height: '32px',
        }}
        onClick={open ? onClose : onOpen}
        toggled={open}
      >
        <FaUser />
      </PrimaryToggleButton>
      {open && (
        <React.Fragment>
          <Flex
            onClick={onClose}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'block',
              width: '100%',
              zIndex: -1,
              bg: 'modalBg',
            }}
          />
          <Box
            ref={scrollRef}
            sx={{
              position: 'absolute',
              top: '100%',
              right: 0,
              overflowY: 'scroll',
            }}
            role="menu"
          >
            <LightPanel>{children}</LightPanel>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};
export default OverlayMenu;
