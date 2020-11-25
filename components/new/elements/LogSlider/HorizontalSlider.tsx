/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Box } from 'theme-ui';
import { getTrackBackground, Range } from 'react-range';
import { RGBColor } from './index';

const HorizontalSlider = (props: {
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
  convertMark?: (value: number) => string;
  className?: string;
}): JSX.Element => {
  const solidColor = `rgba(${props.color[0]},${props.color[1]},${props.color[2]},0.6)`;
  return (
    <Box sx={{ width: '100%' }} className={props.className}>
      <Range
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
                    width: index % 2 ? '1px' : '2px',
                    height: index % 2 ? props.width / 2 + 'px' : props.width + 'px',
                    backgroundColor:
                      index * props.step > props.max - props.value
                        ? solidColor
                        : 'rgba(255,255,255,0.2)',
                  }}
                />
              )
            : undefined
        }
        renderTrack={({ props: trackProps, children }) => (
          <div
            onMouseDown={trackProps.onMouseDown}
            onTouchStart={trackProps.onTouchStart}
            style={{
              ...trackProps.style,
              height: props.width + 'px',
              display: 'flex',
              width: '100%',
            }}
          >
            <Box
              ref={trackProps.ref}
              sx={{
                height: props.width + 'px',
                width: '100%',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: solidColor,
                background: getTrackBackground({
                  values: [props.value],
                  colors: ['rgba(255,255,255,0.2)', 'transparent'],
                  min: props.min,
                  max: props.max,
                }),
                ':hover': {
                  background: getTrackBackground({
                    values: [props.value],
                    colors: [
                      `rgba(${props.color[0]},${props.color[1]},${props.color[2]},0.6)`,
                      'transparent',
                    ],
                    min: props.min,
                    max: props.max,
                  }),
                },
                alignSelf: 'center',
              }}
            >
              {children}
            </Box>
          </div>
        )}
        renderThumb={({ props: thumbProps, isDragged }) => {
          return (
            <div
              {...thumbProps}
              style={{
                ...thumbProps.style,
                height: props.width + 'px',
                width: props.width + 'px',
                borderRadius: '4px',
                backgroundColor: '#FFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                outlineColor: solidColor,
                boxShadow: '0px 1px 6px #AAA',
              }}
            >
              {props.text && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '0px',
                    left: props.width + 4 + 'px',
                    color: '#000',
                    fontWeight: 'bold',
                    padding: '4px',
                    borderRadius: '4px',
                    backgroundColor: solidColor,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {props.text}
                </Box>
              )}
              <Box
                sx={{
                  width: '16px',
                  height: '4px',
                  backgroundColor: isDragged ? solidColor : '#CCC',
                }}
              />
            </div>
          );
        }}
      />
    </Box>
  );
};
export default HorizontalSlider;
