/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, IconButton as ThemeUiIconButton } from 'theme-ui';
import * as React from 'react';

const PrimaryIconButton = (props: React.ComponentPropsWithRef<'button'>): JSX.Element => {
  return <ThemeUiIconButton variant="primary" {...props} />;
};

const SecondaryIconButton = (props: React.ComponentPropsWithRef<'button'>): JSX.Element => {
  return <ThemeUiIconButton variant="secondary" {...props} />;
};

const TertiaryIconButton = (props: React.ComponentPropsWithRef<'button'>): JSX.Element => {
  return <ThemeUiIconButton variant="tertiary" {...props} />;
};

export { PrimaryIconButton, SecondaryIconButton, TertiaryIconButton };

export default PrimaryIconButton;
