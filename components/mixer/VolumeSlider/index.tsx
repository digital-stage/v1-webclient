/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Text, Flex } from 'theme-ui';
import { Direction, Range } from 'react-range';
import React, { useCallback, useEffect, useState } from 'react';
import { convertRangeToDbMeasure, formatDbMeasure, getBaseLog } from './utils';
import { IAnalyserNode, IAudioContext } from 'standardized-audio-context';
import LevelMeter from './LevelMeter';

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

const VolumeSlider = (props: {
  min: number;
  middle: number;
  max: number;
  value: number;
  analyserL?: IAnalyserNode<IAudioContext>;
  analyserR?: IAnalyserNode<IAudioContext>;
  onChange: (value: number) => any;
  onFinalChange?: (value: number) => any;
  alignLabel?: 'left' | 'right';
}): JSX.Element => {
  const {
    onChange,
    onFinalChange,
    min,
    middle,
    max,
    value,
    alignLabel,
    analyserL,
    analyserR,
  } = props;
  const [internalValue, setInternalValue] = useState<number>();
  const [dbValue, setDbValue] = useState<number>();

  const convertLinearToLog = useCallback(
    (value: number): number => {
      if (value > NULL_VALUE) {
        const y = (value - NULL_VALUE) / (MAX - NULL_VALUE);
        return Math.pow(y, UPPER_BASE) * (max - middle) + middle;
      } else {
        const y = (value / NULL_VALUE) * (LOWER_BASE - 1) + 1;
        return getBaseLog(LOWER_BASE, y);
      }
    },
    [middle, max]
  );

  const convertLogToLinear = useCallback(
    (value: number): number => {
      if (value > middle) {
        return (
          Math.round(
            Math.pow((value - middle) / (max - middle), 1 / UPPER_BASE) * (MAX - NULL_VALUE)
          ) + NULL_VALUE
        );
      } else {
        return Math.round(((Math.pow(LOWER_BASE, value) - 1) / (LOWER_BASE - 1)) * NULL_VALUE);
      }
    },
    [middle, max]
  );

  useEffect(() => {
    setInternalValue(convertLogToLinear(value));
    setDbValue(convertRangeToDbMeasure(value));
  }, [value, convertLogToLinear]);

  const handleSliderChange = useCallback(
    (value: number) => {
      if (onChange) {
        const volume = convertLinearToLog(value);
        onChange(volume);
      }
    },
    [onChange, convertLinearToLog]
  );

  const handleFinalSliderChange = useCallback(
    (value: number) => {
      if (onFinalChange) {
        const volume = convertLinearToLog(value);
        onFinalChange(volume);
      }
    },
    [onFinalChange, convertLinearToLog]
  );

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minWidth: '100px',
      }}
    >
      <Range
        sx={{
          width: '100%',
          flexGrow: 1,
        }}
        direction={Direction.Up}
        step={STEP}
        min={MIN}
        max={MAX}
        values={[internalValue]}
        onChange={(values) => handleSliderChange(values[0])}
        onFinalChange={(values) => handleFinalSliderChange(values[0])}
        renderMark={({ props, index }) => (
          <div {...props}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: '28px',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                backgroundColor: '#9A9A9A',
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: '40px',
                transform: 'translateY(-50%)',
                color: '#9A9A9A',
              }}
            >
              {formatDbMeasure(convertRangeToDbMeasure(convertLinearToLog((20 - index) * 5)))}
            </span>
          </div>
        )}
        renderTrack={({ props, children }) => (
          <div
            ref={props.ref}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
              width: '24px',
              height: '100%',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '5px',
                height: '100%',
                backgroundColor: '#9A9A9A',
              }}
            >
              {analyserL && <LevelMeter analyser={analyserL} />}
              {analyserR && <LevelMeter analyser={analyserR} />}
            </div>
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => {
          return (
            <div
              {...props}
              style={{
                ...props.style,
                height: '24px',
                width: '24px',
                borderRadius: '50%',
                boxShadow: '0px 3px 6px #00000040',
                background: isDragged
                  ? 'linear-gradient(to bottom, #6F92F8, #6F92F8 49%, #5779D9 50%, #5779D9)'
                  : 'linear-gradient(to bottom, #FFFFFF, #FFFFFF 49%, #9A9A9A 50%, #9A9A9A)',
              }}
            />
          );
        }}
      />
      <Text
        sx={{
          flexGrow: 0,
          textAlign: 'center',
          minWidth: '50px',
        }}
        variant="micro"
      >
        {formatDbMeasure(dbValue)} db
      </Text>
    </Flex>
  );
};
export default VolumeSlider;
