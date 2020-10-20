import React, {useEffect, useState} from "react";
import {Slider, Typography, withStyles} from "@material-ui/core";


const marks = [
    {
        value: 0,
        label: '-∞',
    },
    {
        value: 0.25,
        label: '25%',
    },
    {
        value: 0.5,
        label: '50%',
    },
    {
        value: 0.75,
        label: '75%',
    },
    {
        value: 1,
        label: '0db',
    }
]

function valueLabelFormat(value: number) {
    return `${value.toFixed(2)}%`;
}

const VerticalSlider = (
    props: {
        value: number;
        onEnd: (value: number) => any;
        min?: number;
        max?: number;
        step?: number;
    }
) => {
    const [value, setValue] = useState<number>(props.value);

    useEffect(() => {
        setValue(props.value)
    }, [props.value]);

    return <>
        <Slider
            onChangeCommitted={(e, v) => {
                if (props.onEnd && !Array.isArray(v))
                    props.onEnd(v)
            }}
            orientation="vertical"
            value={value}
            min={props.min}
            max={props.max}
            step={props.step}
            marks={marks}
            //scale={(x) => x ** 10}
            onChange={(e, value) => {
                if (!Array.isArray(value)) {
                    setValue(value)
                }
            }}
            getAriaValueText={valueLabelFormat}
            valueLabelFormat={valueLabelFormat}
            valueLabelDisplay="auto"
        /></>
};
export default VerticalSlider;