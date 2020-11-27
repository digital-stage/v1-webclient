import * as React from 'react';
import StageMemberChannel from './StageMemberChannel';
import { useStageWebAudio } from '../../../../lib/useStageWebAudio';
import { useCallback } from 'react';
import { useGroup, useIsStageAdmin, useSelector } from '../../../../lib/use-digital-stage/hooks';
import { CustomGroup } from '../../../../lib/use-digital-stage/types';
import { useStageActions } from '../../../../lib/use-digital-stage';
import { Button } from 'theme-ui';
import { Flex, Box } from 'theme-ui';
import ChannelStrip from '../../ChannelStrip';

const GroupChannel = (props: { groupId: string }) => {
  const { groupId } = props;
  const isAdmin = useIsStageAdmin();
  const group = useGroup(groupId);
  const customGroup = useSelector<CustomGroup>((state) =>
    state.customGroups.byGroup[groupId]
      ? state.customGroups.byId[state.customGroups.byGroup[groupId]]
      : undefined
  );
  const stageMemberIds = useSelector<string[]>((state) =>
    state.stageMembers.byGroup[groupId] ? state.stageMembers.byGroup[groupId] : []
  );

  const { byGroup } = useStageWebAudio();

  const { updateGroup, setCustomGroup, removeCustomGroup } = useStageActions();

  const [expanded, setExpanded] = React.useState<boolean>();

  const handleVolumeChange = useCallback(
    (volume: number, muted: boolean) => {
      console.debug(group._id, volume, muted);
      if (isAdmin) {
        updateGroup(group._id, {
          volume,
          muted,
        });
      }
    },
    [isAdmin, group, updateGroup]
  );

  const handleCustomVolumeChange = useCallback(
    (volume: number, muted: boolean) => {
      setCustomGroup(group._id, volume, muted);
    },
    [group, setCustomGroup]
  );

  const handleCustomVolumeReset = useCallback(() => {
    if (customGroup) removeCustomGroup(customGroup._id);
  }, [customGroup, setCustomGroup]);

  return (
    <Flex
      sx={{
        flexDirection: 'row',
        borderRadius: '20px',
        marginRight: '1rem',
      }}
    >
      <Box
        sx={{
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          height: '100%',
        }}
      >
        <ChannelStrip
          addHeader={
            <Box
              sx={{
                width: '100%',
                height: '64px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {stageMemberIds.length > 0 ? (
                <Button onClick={() => setExpanded((prev) => !prev)}>
                  <h3>{group.name}</h3>
                  {expanded ? (
                    <img src="/static/chevron_left-white-18dp.svg" alt="collapse" />
                  ) : (
                    <img src="/static/chevron_right-white-18dp.svg" alt="expand" />
                  )}
                </Button>
              ) : (
                <h3>{group.name}</h3>
              )}
            </Box>
          }
          analyser={byGroup[groupId] ? byGroup[groupId].analyserNode : undefined}
          volume={group.volume}
          muted={group.muted}
          customVolume={customGroup ? customGroup.volume : undefined}
          customMuted={customGroup ? customGroup.muted : undefined}
          onVolumeChanged={handleVolumeChange}
          onCustomVolumeChanged={handleCustomVolumeChange}
          onCustomVolumeReset={handleCustomVolumeReset}
          isAdmin={isAdmin}
        />
      </Box>

      {expanded && (
        <Flex
          sx={{
            paddingTop: '1rem',
            paddingBottom: '1rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            flexDirection: 'row',
            height: '100%',
          }}
        >
          <Flex
            sx={{
              flexDirection: 'row',
              backgroundColor: 'rgba(130,100,130,1)',
              borderRadius: '20px',
              height: '100%',
            }}
          >
            {stageMemberIds.map((id, index) => (
              <Box
                sx={{
                  height: '100%',
                }}
                key={index}
              >
                <StageMemberChannel key={id} stageMemberId={id} />
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
export default GroupChannel;
