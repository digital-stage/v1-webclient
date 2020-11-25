/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from 'theme-ui';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import GroupChannel from '../new/elements/MixingPanel/channels/GroupChannel';
import GroupMixer from './GroupMixer';

const AllGroupsMixers = (): JSX.Element => {
  const groupIds = useStageSelector<string[]>((state) =>
    state.stageId ? state.groups.byStage[state.stageId] : []
  );

  return (
    <Flex>
      {groupIds.map((id) => (
        <GroupChannel key={id} groupId={id} />
      ))}
    </Flex>
  );
};

export default AllGroupsMixers;
