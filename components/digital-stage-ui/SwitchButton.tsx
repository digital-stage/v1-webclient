import React from 'react';
import {createStyles, Switch, SwitchClassKey, SwitchProps, Theme, withStyles} from '@material-ui/core';
import theme from '../../styles/theme'

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 50,
      height: 24,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 2,
      '&$checked': {
        transform: 'translateX(25px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: theme.palette.secondary.main,
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 20,
      height: 20,
    },
    track: {
      borderRadius: 18,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: "#A7A7A7",
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default function SwitchButton() {
  const [state, setState] = React.useState({
    checked: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div>
      <IOSSwitch checked={state.checked} onChange={handleChange} name="checked" />
    </div>
  );
}