/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex, SxStyleProp, css } from 'theme-ui';
import { Interpolation } from '@emotion/serialize';

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
        bg: 'white',
      }}
    >
      {children}
    </Flex>
  );
};

const LightPanel = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;

  return (
    <Flex
      sx={{
        ...baseSx,
        flexDirection: 'column',
        bg: 'gray.4',
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
        bg: 'gray.7',
      }}
    >
      {children}
    </Flex>
  );
};

const DefaultPanel = (
  props: React.ComponentProps<'div'> & {
    children: React.ReactNode;
    styles?: Interpolation;
  }
): JSX.Element => {
  const { children, styles } = props;

  return (
    <Flex
      {...props}
      sx={{
        ...baseSx,
        flexDirection: 'column',
        bg: 'gray.7',
      }}
      css={css(styles)}
    >
      {children}
    </Flex>
  );
};

export { DarkPanel, LightPanel, WhitePanel };
export default DefaultPanel;
