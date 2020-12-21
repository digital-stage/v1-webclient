/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React, { useCallback } from 'react';
import { jsx, Box, Flex, Button, Text } from 'theme-ui';
import { FaHeadphonesAlt } from 'react-icons/fa';
import { IoMdSync } from 'react-icons/io';
import { IAnalyserNode, IAudioContext } from 'standardized-audio-context';
import LevelControlFader from './LevelControlFader';
import LevelMeter from './LevelMeter';

const ChannelStrip = (props: {
  addHeader?: React.ReactNode;
  analyserL?: IAnalyserNode<IAudioContext>;
  analyserR?: IAnalyserNode<IAudioContext>;
  isAdmin?: boolean;
  volume: number;
  muted: boolean;
  customVolume?: number;
  customMuted?: boolean;
  onVolumeChanged: (volume: number, muted: boolean) => void;
  onCustomVolumeChanged: (volume: number, muted: boolean) => void;
  onCustomVolumeReset: () => void;
  className?: string;
}): JSX.Element => {
  const addCustom = useCallback(() => {
    if (props.onCustomVolumeChanged) props.onCustomVolumeChanged(props.volume, props.muted);
  }, [props.volume, props.muted]);

  const addSync = useCallback(
    (volume, muted) => {
      if (props.onVolumeChanged) props.onVolumeChanged(volume, muted);
    },
    [props.volume, props.muted]
  );

  const handleMuteClicked = React.useCallback(() => {
    addSync(props.volume, !props.muted);
  }, [props.volume, props.muted]);

  return (
    <Flex
      sx={{
        height: '100%',
        width: '150px',
        minWidth: '150px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className={props.className}
    >
      {props.addHeader && (
        <Box
          sx={{
            width: '100%',
            flexShrink: 0,
            flexGrow: 0,
          }}
        >
          {props.addHeader}
        </Box>
      )}

      <Flex
        sx={{
          width: '100%',
          flexShrink: 0,
          flexGrow: 1,
          height: '1px',
          minHeight: '100px',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {props.isAdmin ? (
          <React.Fragment>
            <LevelControlFader
              volume={props.volume}
              muted={props.muted}
              onChanged={(value, muted) => {
                if (props.onVolumeChanged) props.onVolumeChanged(value, muted);
              }}
              color={[255, 255, 255]}
              backgroundColor="linear-gradient(180deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%)"
              alignLabel="left"
              trackColor="#2452CE\"
            />
            {props.customVolume ? (
              <LevelControlFader
                volume={props.customVolume || props.volume}
                muted={props.customMuted}
                onChanged={(value, muted) => {
                  if (props.onCustomVolumeChanged) props.onCustomVolumeChanged(value, muted);
                }}
                color={[87, 121, 217]}
                backgroundColor="linear-gradient(180deg,  #FE8080 0%, #FE8080 2%, #FE8080 2%, #FE8080 10%,  #2452CE 90%, #2452CE 100%)"
                alignLabel="right"
                trackColor="#fff"
              />
            ) : undefined}
          </React.Fragment>
        ) : (
          <LevelControlFader
            volume={props.customVolume || props.volume}
            muted={props.muted || props.customMuted}
            onChanged={(value, muted) => {
              if (props.onCustomVolumeChanged) props.onCustomVolumeChanged(value, muted);
            }}
            color={props.customVolume ? [103, 103, 103] : [255, 255, 255]}
            backgroundColor={
              props.customVolume
                ? 'linear-gradient(180deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%)'
                : 'linear-gradient(180deg,  #FE8080 0%, #FE8080 2%, #FE8080 2%, #FE8080 10%,  #FE8080 50%, #012340 100%)'
            }
          />
        )}
        {props.analyserL ? (
          <LevelMeter
            sx={{
              width: '4px',
              // borderRadius:'2px',
              flexShrink: 1,
              height: '260px',
            }}
            analyser={props.analyserL}
          />
        ) : undefined}
        {props.analyserR ? (
          <LevelMeter
            sx={{
              width: '4px',
              // borderRadius:'2px',
              flexShrink: 1,
              height: '260px',
            }}
            analyser={props.analyserR}
          />
        ) : undefined}
      </Flex>
      <Flex>
        <Flex sx={{ flexDirection: 'column', mr: 3, alignItems: 'center' }}>
          <Button
            variant={props.muted ? 'primary' : 'tertiary'}
            sx={{ borderRadius: '50%', width: '32px', height: '32px', p: 0 }}
            onClick={handleMuteClicked}
          >
            M
          </Button>
          {/* <Text>Mute</Text> */}
        </Flex>
        {props.customVolume ? (
          <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant="tertiary"
              sx={{ borderRadius: '50%', width: '32px', height: '32px', p: 0 }}
              onClick={() => {
                if (props.onCustomVolumeReset) props.onCustomVolumeReset();
              }}
            >
              <FaHeadphonesAlt sx={{ width: '16px', height: '16px' }} />
            </Button>
            {/* <Text>Monitor</Text> */}
          </Flex>
        ) : (
          props.isAdmin && (
            <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
              <Button
                variant="white"
                sx={{ borderRadius: '50%', width: '32px', height: '32px', px: 0 }}
                onClick={addCustom}
              >
                <IoMdSync sx={{ width: '16px', height: '16px' }} />
              </Button>
              {/* <Text>Sync</Text> */}
            </Flex>
          )
        )}
      </Flex>
    </Flex>
  );
};
export default ChannelStrip;
