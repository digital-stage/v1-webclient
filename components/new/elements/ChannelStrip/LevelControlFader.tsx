import React, { useCallback, useEffect, useState } from 'react';
import { styled } from 'styletron-react';
import LogSlider, { RGBColor } from '../LogSlider';
import Button from '../../../../uikit/Button';

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const VolumeAction = styled('div', {
  display: 'block',
  paddingBottom: '.6rem',
});

const LevelControlFader = (
  props: {
    muted: boolean;
    volume: number;
    color?: RGBColor;
    onChanged: (volume: number, muted: boolean) => any;
    className?: string;
    alignLabel?: 'left' | 'right'
  },
) => {
  const {
    volume, onChanged, muted, className, color, alignLabel,
  } = props;
  const [value, setValue] = useState<number>(volume);

  useEffect(() => {
    setValue(volume);
  }, [volume]);

  const handleMuteClicked = useCallback(() => {
    onChanged(value, !muted);
  }, [value, muted]);

  const handleEnd = useCallback((updatedVolume: number) => {
    setValue(updatedVolume);
    onChanged(updatedVolume, muted);
  }, [muted]);

  return (
    <Wrapper
      className={className}
    >
      <VolumeAction>
        <Button
          kind={muted ? 'primary' : 'minimal'}
          shape="circle"
          aria-label="mute"
          onClick={handleMuteClicked}
        >
          M
        </Button>
      </VolumeAction>
      <LogSlider
        min={0}
        middle={1}
        max={4}
        width={16}
        color={color || [255, 255, 255]}
        volume={value}
        onChange={(changedVolume) => setValue(changedVolume)}
        onEnd={handleEnd}
        alignLabel={alignLabel}
      />
    </Wrapper>
  );
};
export default LevelControlFader;
