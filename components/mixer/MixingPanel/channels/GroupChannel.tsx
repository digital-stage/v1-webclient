import * as React from 'react';
import StageMemberChannel from './StageMemberChannel';
import useStageWebAudio from '../../../../lib/useStageWebAudio';
import { useCallback } from 'react';
import { useGroup, useIsStageAdmin, useSelector } from '../../../../lib/use-digital-stage/hooks';
import { CustomGroup } from '../../../../lib/use-digital-stage/types';
import { useStageActions } from '../../../../lib/use-digital-stage';
import { Flex, Box, IconButton, Heading } from 'theme-ui';
import ChannelStrip from '../../ChannelStrip';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const GroupChannel = (props: { groupId: string; globalMode: boolean }): JSX.Element => {
  const { groupId, globalMode } = props;
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
        flexDirection: 'row',
        bg: 'gray.6',
        borderRadius: 'card',
        ml: 5,
        height: '400px',
        opacity: !isAdmin && globalMode ? '0.5' : '1',
      }}
    >
      <Box
        sx={{
          p: 5,
          bg: 'gray.7',
          borderRadius: 'card',
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
              {stageMemberIds.length > 0 ? (
                <Flex
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    mb: 5,
                  }}
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  <Heading variant="bodySmall">{group.name}</Heading>
                  <Box sx={{ minWidth: '32px' }}>
                    <IconButton>{expanded ? <BsChevronLeft /> : <BsChevronRight />}</IconButton>
                  </Box>
                </Flex>
              ) : (
                <Heading variant="bodySmall" sx={{ mb: 5 }}>
                  {group.name}
                </Heading>
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
          globalMode={globalMode}
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
                  height: '100%',
                }}
                key={index}
              >
                <StageMemberChannel key={id} stageMemberId={id} globalMode={globalMode} />
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
export default GroupChannel;
