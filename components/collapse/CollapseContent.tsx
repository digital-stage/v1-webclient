/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const CollapseContent = (props: { children?: React.ReactNode; isOpen: boolean }) => {
  const { children, isOpen } = props;

  return (
    isOpen && (
      <Flex
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <p>content</p>
      </Flex>
    )
  );
};

export default CollapseContent;
