/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, Text } from 'theme-ui';
import { Interpolation } from '@emotion/serialize';
import React from 'react';

const Regular = (
  props: React.ComponentProps<'div'> & {
    styles?: Interpolation;
    ref?: React.RefObject<HTMLDivElement>;
  }
): JSX.Element => {
  const { styles, ...rest } = props;
  return <Text variant="body" css={css(styles)} {...rest} />;
};

const Micro = (
  props: React.ComponentProps<'div'> & {
    styles?: Interpolation;
    ref?: React.RefObject<HTMLDivElement>;
  }
): JSX.Element => {
  const { styles, ...rest } = props;
  return <Text variant="bodySmall" css={css(styles)} {...rest} />;
};
export { Regular, Micro };

export default Regular;
