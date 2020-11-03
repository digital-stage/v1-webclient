import { default as MaterialIconButton } from '@material-ui/core/IconButton/IconButton';
import * as React from 'react';
import { MouseEventHandler } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const StyledMaterialIconButton = withStyles(({ palette }) => ({
  root: {
    color: palette.text.disabled,
    backgroundColor: palette.grey['800'],
    '&:hover': {
      color: palette.text.primary,
      backgroundColor: palette.grey['800'],
    },
  },
  colorPrimary: {
    color: palette.text.primary,
    backgroundColor: palette.primary.main,
    '&:hover': {
      color: palette.text.secondary,
      backgroundColor: palette.primary.dark,
    },
  },
  colorSecondary: {
    color: palette.text.primary,
    backgroundColor: palette.secondary.main,
    '&:hover': {
      color: palette.text.secondary,
      backgroundColor: palette.secondary.dark,
    },
  },
}))(MaterialIconButton);

export const ToggleIconButton = (props: {
  color?: 'primary' | 'secondary' | 'inherit'
  children: React.ReactNode,
  selected?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: 'small' | 'medium';
}) => (
  <StyledMaterialIconButton
    {...props}
    color={props.selected ? props.color : undefined}
  />
);

export default ToggleIconButton;
