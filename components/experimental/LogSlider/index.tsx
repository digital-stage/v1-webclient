import Input from "@material-ui/core/Input";
import React, {useCallback, useEffect, useState} from "react";
import {calculateDbMeasurement, dbMeasurementToRange, formatDbMeasurement} from "../VolumeFader/util";
import HorizontalSlider from "./HorizontalSlider";
import VerticalSlider from "./VerticalSlider";

export type RGBColor = [number, number, number];

/**
 * Base for the logarithmic ratio below 0db
 */
const LOWER_BASE = 1.1;
/**
 * Base for the exponential ratio above 0db
 */
const UPPER_BASE = 3;

/**
 * Range input settings
 */
const MIN = 0;
const MAX = 100;
const STEP = 5;
const NULL_VALUE = 70;

function getBaseLog(x: number, y: number): number {
    return Math.log(y) / Math.log(x);
}

const LogSlider = (props: {
    volume: number;
    min: number;
    middle: number;
    max: number;
    color: RGBColor;
    onChange: (volume: number) => any;
    onEnd?: (volume: number) => any;
    width: number;
    vertical?: boolean;
}) => {
    const [value, setValue] = useState<number>();
    const [dbValue, setDbValue] = useState<number>(props.volume);

    const convertLinearToLog = useCallback((value: number): number => {
        if (value > NULL_VALUE) {
            const y = (value - NULL_VALUE) / (MAX - NULL_VALUE);
            return (Math.pow(y, UPPER_BASE) * (props.max - props.middle)) + props.middle;
        } else {
            const y = ((value / NULL_VALUE) * (LOWER_BASE - 1)) + 1;
            return getBaseLog(LOWER_BASE, y);
        }
    }, [props.middle, props.max]);

    const convertLogToLinear = useCallback((value: number): number => {
        if (value > props.middle) {
            return Math.round(Math.pow(((value - props.middle) / (props.max - props.middle)), (1 / UPPER_BASE)) * (MAX - NULL_VALUE)) + NULL_VALUE;
        } else {
            return Math.round(((Math.pow(LOWER_BASE, value) - 1) / (LOWER_BASE - 1)) * NULL_VALUE);
        }
    }, [props.middle, props.max]);

    useEffect(() => {
        setValue(convertLogToLinear(props.volume));
        setDbValue(calculateDbMeasurement(props.volume));
    }, [props.volume])

    const handleSliderChange = useCallback((value: number) => {
        props.onChange(convertLinearToLog(value));
    }, [])


    if (props.vertical) {
        return (
            <VerticalSlider
                min={MIN}
                max={MAX}
                step={STEP}
                value={value}
                onChange={handleSliderChange}
                color={props.color}
                width={props.width}
                text={formatDbMeasurement(dbValue)}
            />
        )
    }

    return (
        <>
            <HorizontalSlider
                min={MIN}
                max={MAX}
                step={STEP}
                value={value}
                onChange={handleSliderChange}
                color={props.color}
                width={props.width}
                text={formatDbMeasurement(dbValue)}
            />
            <Input
                type="number"
                value={dbValue.toPrecision(2)}
                onChange={event => {

                    const value = parseInt(event.currentTarget.defaultValue);
                    if (value !== Number.NaN) {
                        console.log(props.volume);
                        const y = dbMeasurementToRange(value);
                        console.log(y);

                    }
                }}
            />
            <p>Internal: {value}</p>
        </>
    )
};

export default LogSlider;