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
import { Group } from '../../../../lib/use-digital-stage';

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
  group?: Group;
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
        mx: 3,
        bg: 'gray.7',
        borderRadius: 'card',
        minHeight: 'calc(100vh - 220px)',
        alignItems: 'center',
      }}
      className={props.className}
    >
      {/* {props.addHeader && <Box sx={{
        width: '100%',
        flexShrink: 0,
        flexGrow: 0,
      }}>{props.addHeader}</Box>} */}

      <Flex
        sx={{
          width: '100%',
          flexShrink: 0,
          flexGrow: 0,
          flexDirection: 'column',
          alignItems: 'center',
          pt: 2,
        }}
      >
        <Box
          bg="primary"
          sx={{
            width: 'group.width',
            height: 'group.height',
            minWidth: 'group.width',
            minHeight: 'group.height',
            borderRadius: '50%',
          }}
        ></Box>
        <Text mb={3}>{props.group.name}</Text>
      </Flex>

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
              trackColor="#2452CE"
            />
            {props.customVolume ? (
              <LevelControlFader
                volume={props.customVolume || props.volume}
                muted={props.customMuted}
                onChanged={(value, muted) => {
                  if (props.onCustomVolumeChanged) props.onCustomVolumeChanged(value, muted);
                }}
                color={[255, 0, 0]}
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
            color={props.customVolume ? [255, 0, 0] : [255, 255, 255]}
            backgroundColor={
              props.customVolume
                ? 'linear-gradient(180deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%)'
                : 'linear-gradient(180deg,  #FE8080 0%, #FE8080 2%, #FE8080 2%, #FE8080 10%,  #FE8080 50%, #012340 100%)'
            }
          />
        )}
        {props.analyser ? (
          <LevelMeter
            sx={{
              width: '10px',
              flexShrink: 1,
              height: '100%',
            }}
            analyser={props.analyser}
          />
        ) : undefined}
      </Flex>
      <Flex sx={{ my: 3 }}>
        <Flex sx={{ flexDirection: 'column', mr: 3, alignItems: 'center' }}>
          <Button
            variant={props.muted ? 'circle' : 'circleOutlined'}
            sx={{ width: '33px', height: '33px' }}
            onClick={handleMuteClicked}
          >
            M
          </Button>
          <Text>Mute</Text>
        </Flex>
        {props.customVolume ? (
          <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant="circleOutlined"
              sx={{ width: '33px', height: '33px' }}
              onClick={() => {
                if (props.onCustomVolumeReset) props.onCustomVolumeReset();
              }}
            >
              <FaHeadphonesAlt />
            </Button>
            <Text>Monitor</Text>
          </Flex>
        ) : (
          props.isAdmin && (
            <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
              <Button
                variant="circleWhite"
                sx={{ width: '33px', height: '33px' }}
                onClick={addCustom}
              >
                <IoMdSync />
              </Button>
              <Text>Sync</Text>
            </Flex>
          )
        )}
      </Flex>
    </Flex>
  );
};
export default ChannelStrip;
