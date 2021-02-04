/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, IconButton as ThemeUiIconButton } from 'theme-ui';
import * as React from 'react';

const PrimaryToggleButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
    toggled: boolean;
  }
): JSX.Element => {
  const { toggled, ...rest } = props;
  return <ThemeUiIconButton variant={toggled ? 'functionToggled' : 'function'} {...rest} />;
};

const TertiaryToggleButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
    toggled: boolean;
  }
): JSX.Element => {
  const { toggled, ...rest } = props;
  return (
    <ThemeUiIconButton
      variant={toggled ? 'functionTertiaryToggled' : 'functionTertiary'}
      {...rest}
    />
  );
};

const DangerToggleButton = (
  props: React.ComponentPropsWithRef<'button'> & {
    as?: React.ElementType;
    toggled: boolean;
  }
): JSX.Element => {
  const { toggled, ...rest } = props;
  return (
    <ThemeUiIconButton variant={toggled ? 'functionDangerToggled' : 'functionDanger'} {...rest} />
  );
};

export { PrimaryToggleButton, TertiaryToggleButton, DangerToggleButton };

export default PrimaryToggleButton;
