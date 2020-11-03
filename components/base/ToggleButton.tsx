import React, { FormEvent } from 'react';
import Button from '@material-ui/core/Button/Button';
import withStyles from '@material-ui/core/styles/withStyles';

const StyledButton = withStyles(({ palette }) => ({
  root: {
    color: palette.text.primary,
    '&:hover': {
      color: palette.text.secondary,
    },
  },
  contained: {
    color: palette.text.disabled,
    backgroundColor: palette.grey['800'],
    '&:hover': {
      color: palette.text.primary,
      backgroundColor: palette.grey['800'],
    },
  },
  containedPrimary: {
    color: palette.text.primary,
    backgroundColor: palette.primary.main,
    '&:hover': {
      color: palette.text.secondary,
      backgroundColor: palette.primary.dark,
    },
  },
  containedSecondary: {
    color: palette.text.primary,
    backgroundColor: palette.secondary.main,
    '&:hover': {
      color: palette.text.secondary,
      backgroundColor: palette.secondary.dark,
    },
  },
  outlined: {
    color: palette.text.disabled,
  },
}))(Button);

const ToggleButton = (props: {
  color: 'primary' | 'secondary' | 'inherit',
  children: React.ReactNode;
  selected: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (event: FormEvent<HTMLButtonElement>) => any;
}) => (
  <StyledButton
    variant="contained"
    {...props}
    color={props.selected ? (props.color || 'primary') : 'default'}
  />
);
export default ToggleButton;
