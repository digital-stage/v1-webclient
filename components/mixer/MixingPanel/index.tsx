import React from 'react';
import { useSelector } from '../../../lib/use-digital-stage/hooks';
import { Flex } from 'theme-ui';
import GroupChannel from './channels/GroupChannel';

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
    <Flex
      sx={{
        position: 'relative',
        maxHeight: '700px',
          minHeight: '600px',
      }}
    >
      {groupIds.map((id) => (
        <GroupChannel key={id} groupId={id} />
      ))}
    </Flex>
  );
};
export default MixingPanel;
