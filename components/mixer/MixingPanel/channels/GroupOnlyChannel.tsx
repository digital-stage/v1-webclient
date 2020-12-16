/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import { useGroup, useIsStageAdmin, useSelector } from '../../../../lib/use-digital-stage/hooks';
import { CustomGroup } from '../../../../lib/use-digital-stage/types';
import { useStageActions } from '../../../../lib/use-digital-stage';
import useStageWebAudio from '../../../../lib/useStageWebAudio';
import ChannelStrip from '../../ChannelStrip';

const GroupOnlyChannel = (props: { groupId: string }): JSX.Element => {
  const { groupId } = props;
  const isAdmin: boolean = useIsStageAdmin();
  const group = useGroup(groupId);
  const customGroup = useSelector<CustomGroup>((state) =>
    state.customGroups.byGroup[groupId]
      ? state.customGroups.byId[state.customGroups.byGroup[groupId]]
      : undefined
  );

  const { updateGroup, setCustomGroup, removeCustomGroup } = useStageActions();
  const { byGroup } = useStageWebAudio();

  return (
    <ChannelStrip
      addHeader={<Text mb={3}>{group.name}</Text>}
      analyserL={byGroup && byGroup[groupId] ? byGroup[groupId].analyserNodeL : undefined}
      analyserR={byGroup && byGroup[groupId] ? byGroup[groupId].analyserNodeR : undefined}
      volume={group.volume}
      muted={group.muted}
      customVolume={customGroup ? customGroup.volume : undefined}
      customMuted={customGroup ? customGroup.muted : undefined}
      onVolumeChanged={
        isAdmin
          ? (volume, muted) =>
              updateGroup(group._id, {
                volume,
                muted,
              })
          : undefined
      }
      onCustomVolumeChanged={(volume, muted) =>
        setCustomGroup(group._id, {
          volume,
          muted,
        })
      }
      onCustomVolumeReset={() => {
        if (removeCustomGroup) return removeCustomGroup(customGroup._id);
        return null;
      }}
      isAdmin={isAdmin}
    />
  );
};
export default GroupOnlyChannel;
