/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useCallback } from 'react';
import { jsx, Flex, Box, Text } from 'theme-ui';
import { Direction, getTrackBackground, Range } from 'react-range';
import { RGBColor } from './index';

const VerticalSlider = (props: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  onFinalChange?: (value: number) => void;
  color: RGBColor;
  width: number;
  text?: string;
  showMarks?: boolean;
  renderMarks?: (index: number) => React.ReactNode;
  className?: string;
  alignLabel?: 'left' | 'right';
  backgroundColor: string;
  trackColor?: string;
  disabled?: boolean;
}): JSX.Element => {
  const renderSingleMark = useCallback(
    (index: number) => {
      const mark = props.renderMarks(index);
      if (mark) {
        return (
          <Box
            sx={{
              position: 'absolute',
              top: '-180%',
              left: props.alignLabel && props.alignLabel === 'left' ? '-850%' : undefined,
              right: !props.alignLabel || props.alignLabel === 'right' ? '140%' : undefined,
            }}
          >
            {mark}
          </Box>
        );
      }
      return undefined;
    },
    [props.renderMarks, props.alignLabel]
  );

  const solidColor = `rgba(${props.color[0]},${props.color[1]},${props.color[2]},0.6)`;
  return (
    <Box
      className={props.className}
      sx={{
        height: '240px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Range
        disabled={props.disabled}
        direction={Direction.Up}
        step={props.step}
        min={props.min}
        max={props.max}
        values={[props.value]}
        onChange={(values) => props.onChange(values[0])}
        onFinalChange={(values) => {
          if (props.onFinalChange) props.onFinalChange(values[0]);
        }}
        renderMark={
          props.showMarks
            ? ({ props: markProps, index }) => (
                <div
                  {...markProps}
                  style={{
                    ...markProps.style,
                    position: 'absolute',
                    right: '900%',
                    height: '4px',
                    width: '4px',
                    marginLeft: '0',
                    borderRadius: '50%',
                    backgroundColor:
                      index * props.step > props.max - props.value
                        ? solidColor
                        : 'rgba(255,255,255,0.2)',
                  }}
                >
                  <Text variant="bodySmall">{renderSingleMark(index)}</Text>
                </div>
              )
            : undefined
        }
        renderTrack={({ props: trackProps, children }) => (
          <div
            onMouseDown={trackProps.onMouseDown}
            onTouchStart={trackProps.onTouchStart}
            style={{
              ...trackProps.style,
              flexGrow: 1,
              display: 'flex',
              height: '100%',
            }}
          >
            <Box
              ref={trackProps.ref}
              sx={{
                height: '240px',
                width: '2px',
                borderRadius: '2px',
                bg: 'gray.3',
                // backgroundImage: props.backgroundColor,
                // ':hover': {
                //   background: getTrackBackground({
                //     values: [props.value],
                //     colors: [
                //       `rgba(${props.color[0]},${props.color[1]},${props.color[2]},0.5)`,
                //       'transparent',
                //     ],
                //     min: props.min,
                //     max: props.max,
                //     direction: Direction.Up,
                //   }),
                // },
                alignSelf: 'center',
              }}
            >
              {children}
            </Box>
          </div>
        )}
        renderThumb={({ props: thumbProps, isDragged }) => (
          <div
            {...thumbProps}
            style={{
              ...thumbProps.style,
              // width: '20px',
              // height: '40px',
              // borderRadius: '18px',
              // backgroundColor: props.trackColor ? props.trackColor : '#2452CE',
              // display: 'flex',
              // justifyContent: 'center',
              // alignItems: 'center',
              // outlineColor: solidColor,
              // boxShadow: '0px 1px 6px #AAA',
              outline: 0,
              position: 'absolute',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25">
              <g id="Gruppe_12351" data-name="Gruppe 12351" transform="translate(-7981 20853)">
                <g
                  id="Gruppe_12316"
                  data-name="Gruppe 12316"
                  transform="translate(7986 -20854.109)"
                >
                  <circle
                    id="Ellipse_253"
                    data-name="Ellipse 253"
                    cx="12"
                    cy="12"
                    r="12"
                    transform="translate(-5 1.109)"
                    fill="#6f92f8"
                  />
                </g>
                <g
                  id="Gruppe_12317"
                  data-name="Gruppe 12317"
                  transform="translate(7985 -20847.109)"
                >
                  <path
                    id="Pfad_10620"
                    data-name="Pfad 10620"
                    d="M24,12A12,12,0,0,1,0,12C.058,11.994,24.085,11.871,24,12Z"
                    transform="translate(-4 -4.891)"
                    fill="#415ca7"
                  />
                </g>
              </g>
            </svg>
            {/* <Box
              sx={{
                width: '16px',
                height: '4px',
                backgroundColor: isDragged ? solidColor : '#CCC',
              }}
            /> */}
          </div>
        )}
      />
    </Box>
  );
};
export default VerticalSlider;
