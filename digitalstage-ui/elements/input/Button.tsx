/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Button as ThemeUiButton } from 'theme-ui';
import * as React from 'react';

const PrimaryButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
  }
): JSX.Element => {
  return <ThemeUiButton variant="primary" {...props} />;
};

const SecondaryButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
  }
): JSX.Element => {
  return <ThemeUiButton variant="primary" {...props} />;
};

const TertiaryButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
  }
): JSX.Element => {
  return <ThemeUiButton sx={{ color: 'background' }} variant="tertiary" {...props} />;
};

const WhiteButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
  }
): JSX.Element => {
  return <ThemeUiButton variant="white" {...props} />;
};
const DangerButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
  }
): JSX.Element => {
  return <ThemeUiButton variant="danger" {...props} />;
};

export { PrimaryButton, SecondaryButton, TertiaryButton, WhiteButton, DangerButton };
export default PrimaryButton;
