/** @jsxRuntime classic */
/** @jsx jsx */
import { Flex, Text, jsx, Box } from 'theme-ui';
import {
  useAudioProducers,
  useCustomAudioProducers,
  useCustomGroups,
  useCustomStageMembers,
  useSelector,
  useStageActions,
  useStageMembers,
  useUsers,
} from '../../../lib/use-digital-stage';
import React, { useState } from 'react';
import VolumeSlider from '../VolumeSlider';

const GroupRow = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  return <Flex>{children}</Flex>;
};

const VariableMixingPanel = (props: { global: boolean }): JSX.Element => {
  const { global } = props;

  const {
    setCustomGroup,
    setCustomStageMember,
    setCustomStageMemberAudio,
    removeCustomGroup,
    removeCustomStageMember,
    removeCustomStageMemberAudio,
    updateStageMember,
    updateGroup,
    updateStageMemberAudio,
  } = useStageActions();

  // For groups
  const groups = useSelector((state) => {
    if (state.global.stageId && state.groups.byStage[state.global.stageId]) {
      return state.groups.byStage[state.global.stageId].map((id) => state.groups.byId[id]);
    }
    return [];
  });
  const customGroups = useCustomGroups();

  // For stage members
  const users = useUsers();
  const stageMembers = useStageMembers();
  const customStageMembers = useCustomStageMembers();

  // For audio producers
  const audioProducers = useAudioProducers();
  const customAudioProducers = useCustomAudioProducers();

  const [value, setValue] = useState<number>(1);

  return (
    <Flex>
      {groups.map((group) => (
        <Flex sx={{}}>{group.name}</Flex>
      ))}
      <VolumeSlider
        min={0}
        middle={1}
        max={4}
        value={value}
        onChange={(value) => setValue(value)}
      />
    </Flex>
  );
};
export default VariableMixingPanel;
