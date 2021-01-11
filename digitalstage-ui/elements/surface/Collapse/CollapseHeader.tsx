/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex, Box } from 'theme-ui';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import PrimaryIconButton from '../../input/IconButton';

interface Props {
  children: React.ReactNode;
  isOpen: boolean;

  onClick?(): void;

  id: string;
  collapseId: string;
}

const CollapseHeader = (props: Props): JSX.Element => {
  const { children, onClick, isOpen, id, collapseId } = props;

  return (
    <Flex
      sx={{
        width: '100%',
        bg: 'gray.7',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
      }}
    >
      <Box sx={{ width: '100%' }}>{children}</Box>
      <PrimaryIconButton onClick={onClick}>
        {isOpen && id === collapseId ? <FaChevronDown /> : <FaChevronLeft />}
      </PrimaryIconButton>
    </Flex>
  );
};

export default CollapseHeader;
