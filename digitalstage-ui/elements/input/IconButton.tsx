/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, IconButton as ThemeUiIconButton } from 'theme-ui';
import * as React from 'react';

const PrimaryIconButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
  }
): JSX.Element => {
  return <ThemeUiIconButton variant="icon" {...props} />;
};
const TertiaryIconButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
  }
): JSX.Element => {
  return <ThemeUiIconButton variant="iconTertiary" {...props} />;
};

const DangerIconButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
  }
): JSX.Element => {
  return <ThemeUiIconButton variant="iconDanger" {...props} />;
};

export { DangerIconButton, PrimaryIconButton, TertiaryIconButton };

export default PrimaryIconButton;
