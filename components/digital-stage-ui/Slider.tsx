import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialSlider from '@material-ui/core/Slider';
import theme from '../../styles/theme';

const CustomSlider = withStyles({
  root: {
    color: '#828282',
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
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 2,
    borderRadius: 4,
  },
  rail: {
    height: 2,
    borderRadius: 4,
  },
})(MaterialSlider);

export default function Slider(props:{
    text?:string,
    defaultValue:number,
    handleChange(event: any, newValue: number | number[]):void,
    max:number,
    min:number,
    step:number
}) {

    return (
        <React.Fragment>
            <Typography id="slider" gutterBottom align="center">
                {props.text}
            </Typography>
            <div>
                <CustomSlider
                    color="secondary"
                    aria-labelledby="discrete-slider-custom"
                    defaultValue={props.defaultValue}
                    step={props.step}
                    min={props.min}
                    max={props.max}
                    onChange={props.handleChange}
                />
            </div>
        </React.Fragment>
    );
}