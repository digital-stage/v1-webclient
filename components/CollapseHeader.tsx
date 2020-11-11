/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, IconButton } from 'theme-ui';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClick?(): void;
}

const CollapseHeader = ({ children, isOpen, onClick }: Props): JSX.Element => (
  <Flex
    sx={{
      width: '100%',
      bg: 'background',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 3,
    }}
  >
    <Box sx={{ width: '100%' }}>{children}</Box>
    <IconButton onClick={onClick}>{isOpen ? <FaChevronDown /> : <FaChevronLeft />}</IconButton>
  </Flex>
);

export default CollapseHeader;
