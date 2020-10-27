import * as React from 'react';
import {Direction, getTrackBackground, Range} from 'react-range';

const VolumeSlider = (props: {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void
    onEnd?: (value: number) => void,
    color: string
}) => {

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}
        >
            <Range
                step={props.step}
                min={props.min}
                max={props.max}
                values={[props.value]}
                onChange={values => props.onChange(values[0])}
                onFinalChange={(values) => {
                    if (props.onEnd)
                        props.onEnd(values[0]);
                }}
                renderTrack={({props: trackProps, children}) => (
                    <div
                        onMouseDown={trackProps.onMouseDown}
                        onTouchStart={trackProps.onTouchStart}
                        style={{
                            ...trackProps.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%'
                        }}
                    >
                        <div
                            ref={trackProps.ref}
                            style={{
                                height: '20px',
                                width: '100%',
                                background: getTrackBackground({
                                    values: [props.value],
                                    colors: [props.color, "rgba(255, 255, 255, 0.2)"],
                                    min: props.min,
                                    max: props.max
                                }),
                                alignSelf: 'center'
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({props, isDragged}) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '20px',
                            width: '20px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px #AAA',
                            border: 'solid 1px #000',
                            opacity: 0.5,
                        }}
                    >
                        <div
                            style={{
                                height: '16px',
                                width: '5px',
                                backgroundColor: isDragged ? '#548BF4' : '#CCC'
                            }}
                        />
                    </div>
                )}
            />
            <output style={{marginTop: '30px'}} id="output">
                {props.value.toFixed(1)}
            </output>
        </div>
    )
}
export default VolumeSlider;