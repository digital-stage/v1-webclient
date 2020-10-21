import React, {useEffect, useRef, useState} from "react";
import {styled} from "baseui";
import {Direction, Range, getTrackBackground} from 'react-range';

// Reference: http://twiggle-web-design.com/tutorials/Custom-Vertical-Input-Range-CSS3.html

const Slider = styled("input", (props: {
    $value: number;
    $color?: string;
}) => ({
    WebkitAppearance: "slider-vertical",
    width: "100%",
    height: "100%",
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
    onChange?: (value: number) => void
    onEnd?: (value: number) => void,
    vertical?: boolean,
    color?: string,
    colorize?: boolean,
}) => {
    const [value, setValue] = useState<number>(props.value);
    const [color, setColor] = useState<string>(props.color);

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

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
            setColor(getColorInverted(value));
        }
    }, [value, props.colorize])

    if (props.vertical) {
        return (
            <Wrapper>
                <Range
                    direction={Direction.Up}
                    step={props.step}
                    min={props.min}
                    max={props.max}
                    values={[value]}
                    onChange={(values) => {
                        setValue(values[0]);
                        if (props.onChange)
                            props.onChange(values[0]);
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
                                backgroundColor: index * props.step > props.max - value ? color : '#ccc'
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
                                        values: [value],
                                        colors: [color, '#ccc'],
                                        min: props.min,
                                        max: props.max,
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
                                    {Math.round((value / props.max) * 100)}%
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

    return (
        <Slider
            type="range"
            step={props.step}
            min={props.min}
            max={props.max}
            value={value}
            $value={props.value}
            $color={props.color}
            onTouchEnd={props.onEnd ? (e) => props.onEnd(e.currentTarget.valueAsNumber) : undefined}
            onChange={(e) => {
                setValue(e.currentTarget.valueAsNumber)
                if (props.onChange)
                    props.onChange(e.currentTarget.valueAsNumber)
            }}/>
    )
}
export default VolumeSlider;