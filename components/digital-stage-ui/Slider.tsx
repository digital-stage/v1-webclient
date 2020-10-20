import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialSlider from '@material-ui/core/Slider';
import theme from '../../styles/theme';
import { Grid } from '@material-ui/core';

const CustomSlider = withStyles({
  root: {
    color: '#FFFFFF',
    height: 2,
    width: 144
  },
  thumb: {
    height: 18,
    width: 18,
    backgroundColor: theme.palette.secondary.main,
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  track: {
    height: 2,
    borderRadius: 4,
  },
  rail: {
    height: 2,
    borderRadius: 4,
  },
})(MaterialSlider);

export default function Slider(props: {
  text?: string,
  defaultValue: number,
  handleChange(event: any, newValue: number | number[]): void,
  max: number,
  min: number,
  step: number
}) {
  const {
    text,
    defaultValue,
    handleChange,
    max,
    min,
    step
  } = props

  return (
    <React.Fragment>
      <Grid container spacing={4}>
        <Grid item>
          <Typography variant="h6" color="textPrimary">
            {text}
          </Typography>
        </Grid>
        <Grid item>
          <CustomSlider
            color="secondary"
            aria-labelledby="discrete-slider-custom"
            defaultValue={defaultValue}
            step={step}
            min={min}
            max={max}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Slider.defaultProps = {
  max: 10,
  min: 0,
  step: 1
};