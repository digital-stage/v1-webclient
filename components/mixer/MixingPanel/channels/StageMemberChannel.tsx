import * as React from 'react';
import useStageWebAudio from '../../../../lib/useStageWebAudio';
import AudioProducerChannel from './AudioProducerChannel';
import { useCallback } from 'react';
import { Flex, Box, IconButton, Heading } from 'theme-ui';
import {
  CustomStageMember,
  useIsStageAdmin,
  useSelector,
  useStageActions,
  useStageMember,
} from '../../../../lib/use-digital-stage';
import ChannelStrip from '../../ChannelStrip';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const StageMemberChannel = (props: { stageMemberId: string; globalMode: boolean }): JSX.Element => {
  const { stageMemberId, globalMode } = props;
  const isAdmin: boolean = useIsStageAdmin();
  const stageMember = useStageMember(stageMemberId);
  const customStageMember = useSelector<CustomStageMember>((state) =>
    state.customStageMembers.byStageMember[props.stageMemberId]
      ? state.customStageMembers.byId[state.customStageMembers.byStageMember[props.stageMemberId]]
      : undefined
  );
  const audioProducers = useSelector<string[]>((state) =>
    state.audioProducers.byStageMember[props.stageMemberId]
      ? state.audioProducers.byStageMember[props.stageMemberId]
      : []
  );

  const { byStageMember } = useStageWebAudio();

  const { updateStageMember, setCustomStageMember, removeCustomStageMember } = useStageActions();

  const [expanded, setExpanded] = React.useState<boolean>();

  const handleVolumeChange = useCallback(
    (volume: number, muted: boolean) => {
      if (isAdmin) {
        updateStageMember(stageMember._id, {
          volume,
          muted,
        });
      }
    },
    [isAdmin, stageMember, updateStageMember]
  );

  const handleCustomVolumeChange = useCallback(
    (volume: number, muted: boolean) => {
      setCustomStageMember(stageMember._id, {
        volume,
        muted,
        x: stageMember.x,
        y: stageMember.y,
        rZ: stageMember.rZ,
      });
    },
    [stageMember, setCustomStageMember]
  );

  const handleCustomVolumeReset = useCallback(() => {
    if (customStageMember) removeCustomStageMember(customStageMember._id);
  }, [customStageMember, removeCustomStageMember]);

  return (
    <Flex
      sx={{
        flexDirection: 'row',
        height: '100%',
        bg: 'gray.5',
        borderBottomRightRadius: 'card',
        borderTopRightRadius: 'card',
      }}
    >
      <Box
        sx={{
          p: 5,
          bg: 'gray.6',
          borderBottomRightRadius: 'card',
          borderTopRightRadius: 'card',
          height: '100%',
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
              }}
            >
              {audioProducers.length > 0 ? (
                <Flex
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    mb: 5,
                  }}
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  <Heading variant="bodySmall">{stageMember.name}</Heading>
                  <Box sx={{ minWidth: '32px' }}>
                    <IconButton>{expanded ? <BsChevronLeft /> : <BsChevronRight />}</IconButton>
                  </Box>
                </Flex>
              ) : (
                <Heading variant="bodySmall" sx={{ mb: 5 }}>
                  {stageMember.name}
                </Heading>
              )}
            </Flex>
          }
          volume={stageMember.volume}
          muted={stageMember.muted}
          customVolume={customStageMember ? customStageMember.volume : undefined}
          customMuted={customStageMember ? customStageMember.muted : undefined}
          analyserL={
            byStageMember && byStageMember[stageMemberId]
              ? byStageMember[stageMemberId].analyserNodeL
              : undefined
          }
          analyserR={
            byStageMember && byStageMember[stageMemberId]
              ? byStageMember[stageMemberId].analyserNodeR
              : undefined
          }
          onVolumeChanged={handleVolumeChange}
          onCustomVolumeChanged={handleCustomVolumeChange}
          onCustomVolumeReset={handleCustomVolumeReset}
          isAdmin={isAdmin}
          globalMode={globalMode}
        />
      </Box>

      {expanded && audioProducers && (
        <Flex
          sx={{
            flexDirection: 'row',
            height: '100%',
          }}
        >
          <Flex
            sx={{
              flexDirection: 'row',
              height: '100%',
            }}
          >
            {audioProducers.map((id, index) => (
              <Box
                sx={{
                  height: '100%',
                }}
                key={index}
              >
                <AudioProducerChannel key={id} audioProducerId={id} globalMode={globalMode} />
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
export default StageMemberChannel;
