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
}): JSX.Element => {
  const renderSingleMark = useCallback(
    (index: number) => {
      const mark = props.renderMarks(index);
      if (mark) {
        return (
          <Box
            sx={{
              position: 'absolute',
              top: '-400%',
              left: props.alignLabel && props.alignLabel === 'left' ? '-800%' : undefined,
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
    <Flex
      className={props.className}
      sx={{
        height: '100%',
        flexDirection: 'column',
        alignItem: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Range
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
                    left: '-150%',
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
                  <Text variant="subTitle">{renderSingleMark(index)}</Text>
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
                height: '100%',
                width: '10px',
                borderRadius: '24px',
                backgroundImage: props.backgroundColor,
                ':hover': {
                  background: getTrackBackground({
                    values: [props.value],
                    colors: [
                      `rgba(${props.color[0]},${props.color[1]},${props.color[2]},0.5)`,
                      'transparent',
                    ],
                    min: props.min,
                    max: props.max,
                    direction: Direction.Up,
                  }),
                },
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
              width: '20px',
              height: '40px',
              borderRadius: '18px',
              backgroundColor: props.trackColor ? props.trackColor : '#2452CE',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              outlineColor: solidColor,
              boxShadow: '0px 1px 6px #AAA',
            }}
          >
            <Box
              sx={{
                width: '16px',
                height: '4px',
                backgroundColor: isDragged ? solidColor : '#CCC',
              }}
            />
          </div>
        )}
      />
    </Flex>
  );
};
export default VerticalSlider;
