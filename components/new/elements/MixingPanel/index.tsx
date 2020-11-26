import React from 'react';
import { Flex } from 'theme-ui';
import GroupChannel from './channels/GroupChannel';
import { useSelector } from '../../../../lib/use-digital-stage/hooks';

/** *
 * The mixing panel shows all available volume controls for an active stage
 * @constructor
 */
const MixingPanelView = (): JSX.Element => {
  const groupIds = useSelector<string[]>((state) =>
    state.global.stageId && state.groups.byStage[state.global.stageId]
      ? state.groups.byStage[state.global.stageId]
      : []
  );

  return (
    <Flex>
      {groupIds.map((id) => (
        <GroupChannel key={id} groupId={id} />
      ))}
    </Flex>
  );
};
export default MixingPanelView;
