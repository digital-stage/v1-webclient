import React from 'react';
import { createStyles, FormControlLabel, Switch, SwitchClassKey, SwitchProps, Theme, Typography, withStyles } from '@material-ui/core';

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

const CustomSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 50,
      height: 24,
      padding: 0,
      margin: theme.spacing(3),
    },
    switchBase: {
      padding: 2,
      '&$checked': {
        transform: 'translateX(25px)',
        color: theme.palette.common.white,
        '& + $track': {
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


export default function SwitchButton(props: {
  color: "primary" | "secondary",
  text?: string
}) {
  const { color, text } = props
  const [state, setState] = React.useState({
    checked: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div>
      <FormControlLabel
        control={<CustomSwitch checked={state.checked} onChange={handleChange} name="checked" color={color}/>}
        label={<Typography variant="h6" color="textPrimary">{text ? text : ""}</Typography>}
        labelPlacement="start"
      />
    </div>
  );
}