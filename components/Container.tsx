/* eslint-disable no-nested-ternary */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';

enum Size {
  default = 'default',
  flex = 'flex',
  stage = 'stage',
  wide = 'wide',
}

const Container = (props: {
  children: React.ReactNode;
  row?: boolean;
  size?: Size;
}) => {
  const { children, row = false, size = 'default' } = props;

  return (
    <Flex
      sx={{
        flexDirection: row ? 'row' : 'column',
        width: '100%',
        maxWidth:
          size === 'default'
            ? 'container.default'
            : size === 'wide'
              ? 'container.wide'
              : size === 'stage' && 'container.stage',
        mt: row && 4,
        mx: 'auto',
        px: 4,
        justifyContent: row && 'space-around',
      }}
    >
      {children}
    </Flex>
  );
};
export default Container;
