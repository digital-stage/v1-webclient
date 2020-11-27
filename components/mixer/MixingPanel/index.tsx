import React from 'react';
import { useSelector } from '../../../lib/use-digital-stage/hooks';
import GroupOnlyChannel from './channels/GroupOnlyChannel';
import { Flex } from 'theme-ui';

/** *
 * The mixing panel shows all available volume controls for an active stage
 * @constructor
 */
const MixingPanel = (): JSX.Element => {
  const groupIds = useSelector<string[]>((state) =>
    state.global.stageId && state.groups.byStage[state.global.stageId]
      ? state.groups.byStage[state.global.stageId]
      : []
  );

  return (
    <Flex>
      {groupIds.map((id) => (
        <GroupOnlyChannel key={id} groupId={id} />
      ))}
    </Flex>
  );
};
export default MixingPanel;
