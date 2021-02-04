/** @jsxRuntime classic */
/** @jsx jsx */
import { Image, jsx } from 'theme-ui';
import * as React from 'react';

const Logo = (
  props: Omit<React.ComponentProps<'img'>, 'src'> & {
    full?: boolean;
    ref?: React.Ref<HTMLImageElement>;
  }
): JSX.Element => {
  const { full } = props;

  return (
    <Image {...props} src={full ? '/static/images/logo-full.svg' : '/static/images/logo.svg'} />
  );
};

export default Logo;
