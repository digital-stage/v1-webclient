/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, css, jsx } from 'theme-ui';
import { FaUser } from 'react-icons/fa';
import React, { useState } from 'react';
import { Interpolation } from '@emotion/serialize';
import { LightPanel } from '../../surface/Panel';
import PrimaryIconButton from '../../input/IconButton';
import PrimaryToggleButton from '../../input/ToggleButton';

const OverlayMenu = (props: {
  styles?: Interpolation;
  children: React.ReactNode | React.ReactNodeArray;
}): JSX.Element => {
  const { styles, children } = props;
  const [open, setOpen] = useState<boolean>(false);

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
        onClick={() => setOpen((prev) => !prev)}
        toggled={open}
      >
        <FaUser />
      </PrimaryToggleButton>
      {open && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
          }}
          role="menu"
        >
          <LightPanel>{children}</LightPanel>
        </Box>
      )}
    </Box>
  );
};
export default OverlayMenu;
