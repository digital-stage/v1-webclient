/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex, SxStyleProp } from 'theme-ui';

const baseSx = {
  boxShadow: 'default',
  borderRadius: 'card',
  py: 6,
  px: [6, 6],
  my: 4,
  mx: 'auto',
};

const WhitePanel = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;

  return (
    <Flex
      sx={{
        ...baseSx,
        flexDirection: 'column',
      }}
    >
      {children}
    </Flex>
  );
};

const DarkPanel = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;

  return (
    <Flex
      sx={{
        ...baseSx,
        flexDirection: 'column',
      }}
    >
      {children}
    </Flex>
  );
};

const DefaultPanel = (
  props: React.ComponentProps<'div'> & {
    children: React.ReactNode;
    sx?: SxStyleProp;
  }
): JSX.Element => {
  const { children, sx } = props;

  return (
    <Flex
      {...props}
      sx={{
        ...baseSx,
        flexDirection: 'column',
        bg: 'gray.7',
        ...sx,
      }}
    >
      {children}
    </Flex>
  );
};

export { DarkPanel, WhitePanel };
export default DefaultPanel;
