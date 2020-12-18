import * as React from 'react';
import StageMemberChannel from './StageMemberChannel';
import useStageWebAudio from '../../../../lib/useStageWebAudio';
import { useCallback } from 'react';
import { useGroup, useIsStageAdmin, useSelector } from '../../../../lib/use-digital-stage/hooks';
import { CustomGroup } from '../../../../lib/use-digital-stage/types';
import { useStageActions } from '../../../../lib/use-digital-stage';
import { Flex, Box, Button } from 'theme-ui';
import ChannelStrip from '../../ChannelStrip';

const GroupChannel = (props: { groupId: string }): JSX.Element => {
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
      setCustomGroup(group._id, { volume, muted });
    },
    [group, setCustomGroup]
  );

  const handleCustomVolumeReset = useCallback(() => {
    if (customGroup) removeCustomGroup(customGroup._id);
  }, [customGroup, setCustomGroup]);

  return (
    <Flex
      sx={{
        // position: 'relative',
        flexDirection: 'row',
        minWidth: 'auto',
        bg: 'gray.6',
        borderRadius:'card',
        ml: 5,
      }}
    >
      <Box
        sx={{
          py: 5,
          bg: 'gray.7',
          borderRadius: 'card',
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
                p: 5,
              }}
            >
              {stageMemberIds.length > 0 ? (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  <h4>{group.name}</h4>
                  <Button
                    sx={{
                      width: '100%',
                    }}
                  >
                    {expanded ? (
                      <img src="/static/icons/chevron_left-white-18dp.svg" alt="collapse" />
                    ) : (
                        <img src="/static/icons/chevron_right-white-18dp.svg" alt="expand" />
                      )}
                  </Button>
                </Box>
              ) : (
                  <h3>{group.name}</h3>
                )}
            </Flex>
          }
          analyserL={byGroup && byGroup[groupId] ? byGroup[groupId].analyserNodeL : undefined}
          analyserR={byGroup && byGroup[groupId] ? byGroup[groupId].analyserNodeR : undefined}
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
            {stageMemberIds.map((id, index) => (
              <Box
                sx={{
                  height: '100%'
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
