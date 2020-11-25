/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useCallback, useEffect, useState } from 'react';
import { jsx, Text } from 'theme-ui';
import VerticalSlider from './VerticalSlider';
import { convertRangeToDbMeasure, formatDbMeasure } from './utils';

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
  onChange?: (volume: number) => any;
  onEnd?: (volume: number) => any;
  width: number;
  className?: string;
  alignLabel?: 'left' | 'right';
}): JSX.Element => {
  const [value, setValue] = useState<number>();
  const [dbValue, setDbValue] = useState<number>(props.volume);

  const convertLinearToLog = useCallback(
    (value: number): number => {
      if (value > NULL_VALUE) {
        const y = (value - NULL_VALUE) / (MAX - NULL_VALUE);
        return Math.pow(y, UPPER_BASE) * (props.max - props.middle) + props.middle;
      }
      const y = (value / NULL_VALUE) * (LOWER_BASE - 1) + 1;
      return getBaseLog(LOWER_BASE, y);
    },
    [props.middle, props.max]
  );

  const convertLogToLinear = useCallback(
    (value: number): number => {
      if (value > props.middle) {
        return (
          Math.round(
            Math.pow((value - props.middle) / (props.max - props.middle), 1 / UPPER_BASE) *
              (MAX - NULL_VALUE)
          ) + NULL_VALUE
        );
      }
      return Math.round(((Math.pow(LOWER_BASE, value) - 1) / (LOWER_BASE - 1)) * NULL_VALUE);
    },
    [props.middle, props.max]
  );

  useEffect(() => {
    setValue(convertLogToLinear(props.volume));
    setDbValue(convertRangeToDbMeasure(props.volume));
  }, [props.volume]);

  const handleSliderChange = useCallback(
    (value: number) => {
      if (props.onChange) {
        const volume = convertLinearToLog(value);
        props.onChange(volume);
      }
    },
    [props.onChange]
  );

  const handleFinalSliderChange = useCallback(
    (value: number) => {
      if (props.onEnd) {
        const volume = convertLinearToLog(value);
        props.onEnd(volume);
      }
    },
    [props.onEnd]
  );

  return (
    <VerticalSlider
      className={props.className}
      min={MIN}
      max={MAX}
      step={STEP}
      value={value}
      onChange={handleSliderChange}
      onFinalChange={handleFinalSliderChange}
      color={props.color}
      width={props.width}
      text={formatDbMeasure(dbValue, true)}
      alignLabel={props.alignLabel}
      showMarks
      renderMarks={(index) => {
        const value = MAX - index * STEP;
        const large: boolean = value === MIN || value === MAX || value === NULL_VALUE;
        if (large) {
          return <Text>{formatDbMeasure(convertRangeToDbMeasure(convertLinearToLog(value)))}</Text>;
        }
      }}
    />
  );
};

export default LogSlider;
