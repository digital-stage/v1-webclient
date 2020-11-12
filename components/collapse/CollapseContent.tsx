/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';

interface Props {
  children?: React.ReactNode;
  isOpen: boolean;
}

const CollapseContent = ({ children, isOpen }: Props): JSX.Element => {
  return (
    isOpen && (
      <Flex
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <p>content</p>
        {children}
      </Flex>
    )
  );
};

export default CollapseContent;
