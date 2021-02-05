/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box, SxStyleProp } from 'theme-ui';

const SettingsPanel = (props: { children: React.ReactNode; sx?: SxStyleProp }): JSX.Element => {
  const { children, sx } = props;
  return <Box sx={sx}>{children}</Box>;
};
export default SettingsPanel;
