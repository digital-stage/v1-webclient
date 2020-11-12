import React, { useCallback } from 'react';
import { Button } from 'baseui/button';
import { styled } from 'baseui';
import { IAnalyserNode, IAudioContext } from 'standardized-audio-context';
import LevelControlFader from './LevelControlFader';
import LevelMeter from './LevelMeter';

const Strip = styled('div', {
  position: 'relative',
  height: '100%',
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  flexShrink: 0,
});

const StripHeader = styled('div', {
  width: '100%',
  flexShrink: 0,
  flexGrow: 0,
});

const ChannelActions = styled('div', {
  width: '100%',
  flexShrink: 0,
  flexGrow: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '60px',
});

const VolumeFader = styled('div', {
  width: '100%',
  flexShrink: 0,
  flexGrow: 1,
  height: '1px',
  minHeight: '100px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
});

const LeftVolumeFader = styled(LevelControlFader, {
  paddingLeft: '.4rem',
  paddingRight: '.4rem',
});
const RightVolumeFader = styled(LevelControlFader, {
  paddingLeft: '.4rem',
  paddingRight: '.4rem',
});

const VolumeMeter = styled(LevelMeter, {
  width: '10px',
  flexShrink: 1,
  height: '100%',
});

const ChannelStrip = (props: {
  addHeader?: React.ReactNode;

  analyser?: IAnalyserNode<IAudioContext>;

  isAdmin?: boolean;
  volume: number;
  muted: boolean;
  customVolume?: number;
  customMuted?: boolean;
  onVolumeChanged?: (volume: number, muted: boolean) => void;
  onCustomVolumeChanged?: (volume: number, muted: boolean) => void;
  onCustomVolumeReset?: () => void;

  className?: string;
}) => {
  const addCustom = useCallback(() => {
    if (props.onCustomVolumeChanged) props.onCustomVolumeChanged(props.volume, props.muted);
  }, [props.volume, props.muted]);

  return (
    <Strip className={props.className}>
      {props.addHeader && <StripHeader>{props.addHeader}</StripHeader>}

      <ChannelActions>
        {props.customVolume ? (
          <Button
            onClick={() => {
              if (props.onCustomVolumeReset) props.onCustomVolumeReset();
            }}
          >
            Reset
          </Button>
        ) : (
          props.isAdmin && <Button onClick={addCustom}>Custom</Button>
        )}
      </ChannelActions>

      <VolumeFader>
        {props.isAdmin ? (
          <>
            <LeftVolumeFader
              volume={props.volume}
              muted={props.muted}
              onChanged={(value, muted) => {
                if (props.onVolumeChanged) props.onVolumeChanged(value, muted);
              }}
              color={[255, 255, 255]}
              alignLabel="left"
            />
            {props.customVolume ? (
              <RightVolumeFader
                volume={props.customVolume || props.volume}
                muted={props.customMuted}
                onChanged={(value, muted) => {
                  if (props.onCustomVolumeChanged) props.onCustomVolumeChanged(value, muted);
                }}
                color={[255, 0, 0]}
                alignLabel="right"
              />
            ) : undefined}
          </>
        ) : (
          <LeftVolumeFader
            volume={props.customVolume || props.volume}
            muted={props.muted || props.customMuted}
            onChanged={(value, muted) => {
              if (props.onCustomVolumeChanged) props.onCustomVolumeChanged(value, muted);
            }}
            color={props.customVolume ? [255, 0, 0] : [255, 255, 255]}
          />
        )}
        {props.analyser ? <VolumeMeter analyser={props.analyser} /> : undefined}
      </VolumeFader>
    </Strip>
  );
};
export default ChannelStrip;
