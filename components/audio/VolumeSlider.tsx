import React from "react";
import {styled} from "baseui";

const Slider = styled("input", (props: {
    $value: number
    $color?: string
}) => ({
    WebkitAppearance: "none",
    width: "100%",
    height: "25px",
    background: "#d3d3d3",
    outline: "none",
    opacity: 0.6,
    padding: 0,
    margin: 0,
    transition: "opacity .2s",
    ":hover": {
        opacity: 1
    },
    "::-webkit-slider-thumb": {
        WebkitAppearance: "none",
        appearance: "none",
        width: "25px",
        height: "25px",
        background: props.$color ? props.$color : "#d3d3d3",
        cursor: "pointer"
    },
    "::-moz-range-thumb": {
        width: "25px",
        height: "25px",
        background: props.$color ? props.$color : "#d3d3d3",
        cursor: "pointer"
    },
}));

export default (props: {
    min: number;
    max: number;
    step: number;
    value: number;
    color?: string;
    onChange: (value: number) => void
}) => {

    return (
        <Slider type="range"
                step={props.step}
                min={props.min}
                max={props.max}
                value={props.value}
                $value={props.value}
                $color={props.color}
                onChange={(e) => props.onChange(e.currentTarget.valueAsNumber)}/>
    )
}
