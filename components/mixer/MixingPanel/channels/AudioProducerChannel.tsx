import React, { useCallback } from 'react';
import useStageWebAudio from '../../../../lib/useStageWebAudio';
import {
  CustomRemoteAudioProducer,
  RemoteAudioProducer,
  useIsStageAdmin,
  useSelector,
  useStageActions,
} from '../../../../lib/use-digital-stage';
import { Flex, Box, Heading } from 'theme-ui';
import ChannelStrip from '../../ChannelStrip';

const AudioProducerChannel = (props: {
  audioProducerId: string;
  globalMode: boolean;
}): JSX.Element => {
  const { audioProducerId, globalMode } = props;
  const isAdmin: boolean = useIsStageAdmin();
  const audioProducer = useSelector<RemoteAudioProducer>(
    (state) => state.audioProducers.byId[props.audioProducerId]
  );
  const customAudioProducer = useSelector<CustomRemoteAudioProducer>((state) =>
    state.customAudioProducers.byAudioProducer[props.audioProducerId]
      ? state.customAudioProducers.byId[
          state.customAudioProducers.byAudioProducer[props.audioProducerId]
        ]
      : undefined
  );

  const { byAudioProducer } = useStageWebAudio();

  const {
    updateStageMemberAudio,
    setCustomStageMemberAudio,
    removeCustomStageMemberAudio,
  } = useStageActions();

  const handleVolumeChange = useCallback(
    (volume: number, muted: boolean) => {
      if (isAdmin) {
        updateStageMemberAudio(audioProducer._id, {
          volume,
          muted,
        });
      }
    },
    [isAdmin, audioProducer, updateStageMemberAudio]
  );

  const handleCustomVolumeChange = useCallback(
    (volume: number, muted: boolean) => {
      setCustomStageMemberAudio(audioProducer._id, {
        volume,
        muted,
      });
    },
    [audioProducer, setCustomStageMemberAudio]
  );

  const handleCustomVolumeReset = useCallback(() => {
    if (customAudioProducer) removeCustomStageMemberAudio(customAudioProducer._id);
  }, [customAudioProducer, removeCustomStageMemberAudio]);

  return (
    <Flex
      sx={{
        flexDirection: 'row',
        height: '100%',
      }}
    >
      <Flex>
        <Box
          sx={{
            height: '100%',
            p: 5,
            width: '120px',
            minWidth: '120px',
            maxWidth: '120px',
          }}
        >
          <ChannelStrip
            addHeader={
              <Flex
                sx={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pb: 5,
                }}
              >
                <Heading variant="bodySmall" sx={{ mb: 5 }}>
                  Track
                </Heading>
              </Flex>
            }
            analyserL={
              byAudioProducer && byAudioProducer[audioProducerId]
                ? byAudioProducer[audioProducerId].analyserNode
                : undefined
            }
            volume={audioProducer.volume}
            muted={audioProducer.muted}
            customVolume={customAudioProducer ? customAudioProducer.volume : undefined}
            customMuted={customAudioProducer ? customAudioProducer.muted : undefined}
            onVolumeChanged={handleVolumeChange}
            onCustomVolumeChanged={handleCustomVolumeChange}
            onCustomVolumeReset={handleCustomVolumeReset}
            isAdmin={isAdmin}
            globalMode={globalMode}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
export default AudioProducerChannel;
