import React from 'react';
import { Flex } from 'theme-ui';
import GroupChannel from './channels/GroupChannel';
import { useGroups } from '../../../../lib/use-digital-stage/hooks';

/** *
 * The mixing panel shows all available volume controls for an active stage
 * @constructor
 */
const MixingPanelView = (): JSX.Element => {
  const groups = useGroups();

  return (
    <Flex>
      {groups.allIds.map((id) => (
        <GroupChannel key={id} groupId={id} />
      ))}
    </Flex>
  );
};
export default MixingPanelView;
