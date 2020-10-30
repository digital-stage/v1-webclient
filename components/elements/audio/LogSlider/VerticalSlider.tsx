import {Direction, getTrackBackground, Range} from "react-range";
import React, {useCallback} from "react";
import {styled, useStyletron} from "styletron-react";
import {RGBColor} from "./index";
import {Typography} from "@material-ui/core";
import {convertRangeToDbMeasure, formatDbMeasure} from "./utils";

const Wrapper = styled("div", {
    display: "flex",
    height: '100%',
    flexDirection: 'column',
    alignItem: "center",
    justifyContent: "center",
    boxSizing: "border-box",
});

const VerticalSlider = (props: {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => any;
    onFinalChange?: (value: number) => any;
    color: RGBColor;
    width: number;
    text?: string;
    showMarks?: boolean;
    renderMarks?: (index: number) => React.ReactNode;
    className?: string;
    alignLabel?: "left" | "right";
}) => {
    const [css] = useStyletron();

    const renderSingleMark = useCallback((index: number) => {
        const mark = props.renderMarks(index);
        if (mark) {
            return (
                <div className={css({
                    position: "absolute",
                    top: "-400%",
                    left: props.alignLabel && props.alignLabel === "left" ? "140%" : undefined,
                    right: !props.alignLabel || props.alignLabel === "right" ? "140%" : undefined,
                })}>
                    {mark}
                </div>
            )
        }
        return undefined;
    }, [props.renderMarks, props.alignLabel]);

    const solidColor = `rgba(${props.color[0]},${props.color[1]},${props.color[2]},0.6)`;
    return (
        <Wrapper className={props.className}>
            <Range
                direction={Direction.Up}
                step={props.step}
                min={props.min}
                max={props.max}
                values={[props.value]}
                onChange={values => props.onChange(values[0])}
                onFinalChange={values => {
                    if (props.onFinalChange)
                        props.onFinalChange(values[0]);
                }}
                renderMark={props.showMarks ? ({props: markProps, index}) => (
                    <div
                        {...markProps}
                        className={css({
                            ...markProps.style,
                            height: index % 2 ? '1px' : '2px',
                            width: index % 2 ? (props.width / 2) + "px" : props.width + "px",
                            backgroundColor: index * props.step > props.max - props.value ? solidColor : 'rgba(255,255,255,0.2)'
                        })}
                    >
                        {renderSingleMark(index)}
                    </div>
                ) : undefined}
                renderTrack={({props: trackProps, children}) => (
                    <div
                        onMouseDown={trackProps.onMouseDown}
                        onTouchStart={trackProps.onTouchStart}
                        className={css({
                            ...trackProps.style,
                            flexGrow: 1,
                            display: 'flex',
                            height: '100%'
                        })}
                    >
                        <div
                            ref={trackProps.ref}
                            className={css({
                                width: props.width + "px",
                                height: '100%',
                                borderWidth: "1px",
                                borderStyle: "solid",
                                borderColor: solidColor,
                                background: getTrackBackground({
                                    values: [props.value],
                                    colors: ["rgba(255,255,255,0.2)", "transparent"],
                                    min: props.min,
                                    max: props.max,
                                    direction: Direction.Up
                                }),
                                ":hover": {
                                    background: getTrackBackground({
                                        values: [props.value],
                                        colors: [`rgba(${props.color[0]},${props.color[1]},${props.color[2]},0.6)`, "transparent"],
                                        min: props.min,
                                        max: props.max,
                                        direction: Direction.Up
                                    })
                                },
                                alignSelf: 'center'
                            })}
                        >
                            {children}
                        </div>
                    </div>
                )}

                renderThumb={({props: thumbProps, isDragged}) => {
                    return (
                        <div
                            {...thumbProps}
                            className={css({
                                ...thumbProps.style,
                                height: props.width + "px",
                                width: props.width + "px",
                                borderRadius: '4px',
                                backgroundColor: '#FFF',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                outlineColor: solidColor,
                                boxShadow: '0px 1px 6px #AAA'
                            })}
                        >
                            {props.text && (
                                <div
                                    className={css({
                                        position: 'absolute',
                                        top: "0px",
                                        right: props.alignLabel && props.alignLabel === "left" ? (props.width + 4) + "px" : undefined,
                                        left: !props.alignLabel || props.alignLabel === "right" ? (props.width + 4) + "px" : undefined,
                                        color: '#000',
                                        fontWeight: 'bold',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        backgroundColor: solidColor,
                                        whiteSpace: 'nowrap'
                                    })}
                                >
                                    {props.text}
                                </div>
                            )}
                            <div
                                className={css({
                                    width: '16px',
                                    height: '4px',
                                    backgroundColor: isDragged ? solidColor : '#CCC'
                                })}
                            />
                        </div>
                    )
                }}
            />
        </Wrapper>
    );
}
export default VerticalSlider;