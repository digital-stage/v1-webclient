/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
}

const CollapseBody = ({ children, isOpen }: Props): JSX.Element => {
  return isOpen ? (
    <Box
      sx={{
        width: '100%',
        bg: 'gray.7',
        px: 3,
        transition: 'all 290ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </Box>
  ) : null;
};

export default CollapseBody;
