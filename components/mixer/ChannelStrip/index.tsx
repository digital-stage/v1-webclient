/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React, { useCallback } from 'react';
import { jsx, Box, Flex, IconButton } from 'theme-ui';
import { FaHeadphonesAlt, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { AiOutlineSync } from 'react-icons/ai';
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
  globalMode?: boolean;
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
          position: 'relative',
        }}
      >
        {/* {props.isAdmin ? ( */}
        <React.Fragment>
          {
            props.globalMode ? (
              <LevelControlFader
                volume={props.volume}
                muted={props.muted}
                onChanged={(value, muted) => {
                  if (props.onVolumeChanged) props.onVolumeChanged(value, muted);
                }}
                color={[154, 154, 154]}
                backgroundColor="linear-gradient(180deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%)"
                alignLabel="left"
                trackColor="#2452CE"
                disabled={!props.isAdmin && props.globalMode}
              />
            ) : (
              // props.customVolume ? (
              <LevelControlFader
                volume={props.customVolume || props.volume}
                muted={props.customMuted}
                onChanged={(value, muted) => {
                  if (props.onCustomVolumeChanged) props.onCustomVolumeChanged(value, muted);
                }}
                color={props.customVolume ? [87, 121, 217] : [154, 154, 154]}
                backgroundColor="linear-gradient(180deg,  #FE8080 0%, #FE8080 2%, #FE8080 2%, #FE8080 10%,  #2452CE 90%, #2452CE 100%)"
                alignLabel="right"
                trackColor="#fff"
              />
            )
            // ) : undefined
          }
        </React.Fragment>
        {/* ) : ( */}
        {/* props.globalMode ? <LevelControlFader
              volume={props.volume}
              muted={props.muted}
              onChanged={(value, muted) => {
                if (props.onVolumeChanged) props.onVolumeChanged(value, muted);
              }}
              color={[255, 0, 0]}
              backgroundColor="linear-gradient(180deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%)"
              alignLabel="left"
              trackColor="#2452CE\"
            />
              :
              <LevelControlFader
                volume={props.customVolume || props.volume}
                muted={props.muted || props.customMuted}
                onChanged={(value, muted) => {
                  if (props.onCustomVolumeChanged) props.onCustomVolumeChanged(value, muted);
                }}
                color={props.customVolume ? [0, 0, 255] : [0, 0, 0]}
                backgroundColor={
                  props.customVolume
                    ? 'linear-gradient(180deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%)'
                    : 'linear-gradient(180deg,  #FE8080 0%, #FE8080 2%, #FE8080 2%, #FE8080 10%,  #FE8080 50%, #012340 100%)'
                }
              /> */}
        {/* )} */}
        {props.analyserL ? (
          <LevelMeter
            sx={{
              width: '6px',
              borderRadius: '2px',
              flexShrink: 1,
              height: '257px',
              position: 'absolute',
              right: '22px',
            }}
            analyser={props.analyserL}
          />
        ) : undefined}
        {props.analyserR ? (
          <LevelMeter
            sx={{
              width: '5px',
              borderRadius: '2px',
              flexShrink: 1,
              height: '257px',
              ml: -2,
            }}
            analyser={props.analyserR}
          />
        ) : undefined}
      </Flex>
      <Flex>
        <Flex sx={{ flexDirection: 'row', alignItems: 'center' }}>
          {props.globalMode && (
            <IconButton
              variant={!props.muted ? 'primary' : 'tertiary'}
              sx={{ borderRadius: '50%', width: '32px', height: '32px', p: 0 }}
              onClick={handleMuteClicked}
              disabled={!props.isAdmin && props.globalMode}
              title={!props.muted && 'Mute'}
            >
              {!props.muted ? <FaMicrophone size="16px" /> : <FaMicrophoneSlash size="16px" />}
            </IconButton>
          )}
          {!props.globalMode && (
            <IconButton
              variant={!props.customVolume ? 'primary' : 'tertiary'}
              sx={{ borderRadius: '50%', width: '32px', height: '32px', p: 0 }}
              onClick={() => {
                if (props.onCustomVolumeReset) props.onCustomVolumeReset();
              }}
              title={props.customVolume && 'Sync'}
            >
              <AiOutlineSync size="16px" />
            </IconButton>
          )}
        </Flex>
        {/* {props.customVolume ? (
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
        {/* </Flex>
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
                <Text>Sync</Text>
              </Flex>
            )
          )}  */}
      </Flex>
    </Flex>
  );
};
export default ChannelStrip;
