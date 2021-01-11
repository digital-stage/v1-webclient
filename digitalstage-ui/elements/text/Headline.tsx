/** @jsxRuntime classic */
/** @jsx jsx */
import { css, Text } from 'theme-ui';
import React from 'react';
import { jsx } from 'theme-ui';
import { Interpolation } from '@emotion/serialize';

const H1 = (props: { children: React.ReactNode; styles?: Interpolation }): JSX.Element => {
  const { children, styles } = props;
  return (
    <Text variant="h1" css={css(styles)}>
      {children}
    </Text>
  );
};
const H2 = (props: { children: React.ReactNode; styles?: Interpolation }): JSX.Element => {
  const { children, styles } = props;
  return (
    <Text variant="h2" css={css(styles)}>
      {children}
    </Text>
  );
};
const H3 = (props: { children: React.ReactNode; styles?: Interpolation }): JSX.Element => {
  const { children, styles } = props;
  return (
    <Text variant="h3" css={css(styles)}>
      {children}
    </Text>
  );
};
const H4 = (props: { children: React.ReactNode; styles?: Interpolation }): JSX.Element => {
  const { children, styles } = props;
  return (
    <Text variant="h4" css={css(styles)}>
      {children}
    </Text>
  );
};

const H5 = (props: { children: React.ReactNode; styles?: Interpolation }): JSX.Element => {
  const { children, styles } = props;
  return (
    <Text variant="h5" css={css(styles)}>
      {children}
    </Text>
  );
};
const H6 = (props: { children: React.ReactNode; styles?: Interpolation }): JSX.Element => {
  const { children, styles } = props;
  return (
    <Text variant="h6" css={css(styles)}>
      {children}
    </Text>
  );
};

const Headline = (props: {
  children: React.ReactNode;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  styles?: Interpolation;
}): JSX.Element => {
  const { children, variant, styles } = props;
  switch (variant) {
    case 'h2': {
      return <H2 styles={styles}>{children}</H2>;
    }
    case 'h3': {
      return <H3 styles={styles}>{children}</H3>;
    }
    case 'h4': {
      return <H4 styles={styles}>{children}</H4>;
    }
    case 'h5': {
      return <H5 styles={styles}>{children}</H5>;
    }
    case 'h6': {
      return <H1 styles={styles}>{children}</H1>;
    }
    case 'h1':
    default: {
      return <H1 styles={styles}>{children}</H1>;
    }
  }
};

export { H1, H2, H3, H4, H5, H6 };

export default Headline;
