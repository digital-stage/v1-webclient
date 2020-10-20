import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MaterialSlider from '@material-ui/core/Slider';
import theme from '../../styles/theme';

const useStyles = makeStyles({
    root: {
        height:144,
        width: 18
    },
});

const CustomSlider = withStyles({
    root: {
      color: '#828282',
      width: 8,
    },
    thumb: {
      height: 18,
      width: 18,
      backgroundColor: theme.palette.secondary.main,
      marginLeft:"-8px !important",
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      width: 8,
      borderRadius: 4,
    },
    rail: {
      width: 8,
      borderRadius: 4,
    },
  })(MaterialSlider);

function valuetext(value: number) {
    return `${value}`;
}

export default function VerticalSlider(props:{
    text:string,
    defaultValue:number,
    handleChange(event: any, newValue: number | number[]):void,
    max:number,
    min:number,
    step:number
}) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography id="slider" gutterBottom align="center">
                {props.text}
            </Typography>
            <div className={classes.root}>
                <CustomSlider
                    color="secondary"
                    orientation="vertical"
                    aria-labelledby="discrete-slider-custom"
                    defaultValue={props.defaultValue}
                    step={props.step}
                    // marks
                    min={props.min}
                    max={props.max}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    onChange={props.handleChange}
                />
            </div>
        </React.Fragment>
    );
}