import React, {useCallback, useEffect, useState} from "react";
import {styled} from "baseui";
import {Direction, Range, getTrackBackground} from 'react-range';
import {calculateDbMeasurement, formatDbMeasurement, LogarithmicConverter} from "./util";

function getColor(value) {
    //value from 0 to 1
    const hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}

function getColorInverted(value) {
    return getColor(1 - value);
}

const Wrapper = styled("div", {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
    boxSizing: "border-box"
});

const VolumeSlider = (props: {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void
    onEnd?: (value: number) => void,
    color?: string,
    colorize?: boolean,
}) => {
    const [color, setColor] = useState<string>(props.color);
    const [value, setValue] = useState<number>(props.value);
    const [scale, setScale] = useState<LogarithmicConverter>();

    useEffect(() => {
        console.log("[VOLUME] Creating range")
        setScale(new LogarithmicConverter(props.min, props.max, 1, 10));
    }, [props.min, props.min])

    useEffect(() => {
        if (scale) {
            setValue(scale.invert(props.value));
        }
    }, [scale, props.value])

    const handleChange = useCallback((value: number) => {
        if (scale) {
            console.log("[VOLUME] Have SCALE")
            const linValue = scale.scale(value);
            console.log(linValue);
            //props.onChange(linValue);
        }
    }, [scale, props.onChange])

    useEffect(() => {
        if (!props.colorize) {
            if (props.color) {
                setColor(props.color);
            } else {
                setColor("yellow");
            }
        }
    }, [props.color, props.colorize]);

    useEffect(() => {
        if (props.colorize) {
            setColor(getColorInverted(props.value));
        }
    }, [props.value, props.colorize]);


    const logStep = 9 / ((props.max - props.min) / props.step);

    return (
        <Wrapper>
            <Range
                direction={Direction.Up}
                step={logStep}
                min={1}
                max={10}
                values={[value]}
                onChange={(values) => {
                    handleChange(values[0]);
                }}
                onFinalChange={(values) => {
                    if (props.onEnd)
                        props.onEnd(values[0]);
                }}
                renderMark={({props: markProps, index}) => (
                    <div
                        {...markProps}
                        style={{
                            ...markProps.style,
                            height: index % 2 ? '1px' : '4px',
                            width: index % 2 ? '10px' : '20px',
                            backgroundColor: index * props.step > props.max - props.value ? color : '#ccc'
                        }}
                    />
                )}
                renderTrack={({props: trackProps, children}) => (
                    <div
                        onMouseDown={trackProps.onMouseDown}
                        onTouchStart={trackProps.onTouchStart}
                        style={{
                            ...trackProps.style,
                            flexGrow: 1,
                            display: 'flex',
                            height: '100%'
                        }}
                    >
                        <div
                            ref={trackProps.ref}
                            style={{
                                width: '5px',
                                height: '100%',
                                borderRadius: '4px',
                                background: getTrackBackground({
                                    values: [props.value],
                                    colors: [color, '#ccc'],
                                    min: 1,
                                    max: 10,
                                    direction: Direction.Up
                                }),
                                alignSelf: 'center'
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({props: thumbProps, isDragged}) => {
                    return (
                        <div
                            {...thumbProps}
                            style={{
                                ...thumbProps.style,
                                height: '32px',
                                width: '32px',
                                borderRadius: '4px',
                                backgroundColor: '#FFF',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                outlineColor: color,
                                boxShadow: '0px 2px 6px #AAA'
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '3px',
                                    left: '36px',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    backgroundColor: color,
                                }}
                            >
                                {formatDbMeasurement(calculateDbMeasurement(props.value))} dB
                            </div>
                            <div
                                style={{
                                    width: '16px',
                                    height: '4px',
                                    backgroundColor: isDragged ? color : '#CCC'
                                }}
                            />
                        </div>
                    )
                }}
            />
        </Wrapper>
    )
}
export default VolumeSlider;