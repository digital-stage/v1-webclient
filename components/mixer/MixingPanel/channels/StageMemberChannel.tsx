import * as React from 'react';
import useStageWebAudio from '../../../../lib/useStageWebAudio';
import AudioProducerChannel from './AudioProducerChannel';
import { useCallback } from 'react';
import { Flex, Box } from 'theme-ui';
import {
  CustomStageMember,
  useIsStageAdmin,
  useSelector,
  useStageActions,
  useStageMember,
} from '../../../../lib/use-digital-stage';
import { Button } from 'theme-ui';
import ChannelStrip from '../../ChannelStrip';

const StageMemberChannel = (props: { stageMemberId: string }) => {
  const { stageMemberId } = props;
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
      }}
    >
      <Box
        sx={{
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '2rem',
          paddingBottom: '2rem',
          height: '100%',
        }}
      >
        <ChannelStrip
          addHeader={
            <Flex
              sx={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
              }}
            >
              {audioProducers.length > 0 ? (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  <h5>{stageMember.name}</h5>
                  <Button
                    sx={{
                      width: '100%',
                    }}
                  >
                    {expanded ? (
                      <img src="/static/icons/chevron_left-white-18dp.svg" />
                    ) : (
                      <img src="/static/icons/chevron_right-white-18dp.svg" />
                    )}
                  </Button>
                </Box>
              ) : (
                <h3>{stageMember.name}</h3>
              )}
            </Flex>
          }
          volume={stageMember.volume}
          muted={stageMember.muted}
          customVolume={customStageMember ? customStageMember.volume : undefined}
          customMuted={customStageMember ? customStageMember.muted : undefined}
          analyser={
            byStageMember[stageMemberId] ? byStageMember[stageMemberId].analyserNodeL : undefined
          }
          onVolumeChanged={handleVolumeChange}
          onCustomVolumeChanged={handleCustomVolumeChange}
          onCustomVolumeReset={handleCustomVolumeReset}
          isAdmin={isAdmin}
        />
      </Box>

      {expanded && audioProducers && (
        <Flex
          sx={{
            flexDirection: 'row',
            height: '100%',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        >
          <Flex
            sx={{
              flexDirection: 'row',
              backgroundColor: 'rgba(100,100,130,1)',
              borderRadius: '20px',
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
                <AudioProducerChannel key={id} audioProducerId={id} />
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
export default StageMemberChannel;
