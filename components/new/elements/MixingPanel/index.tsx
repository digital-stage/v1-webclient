import React from 'react';
import { Flex } from 'theme-ui';
import useStageSelector from '../../../../lib/digitalstage/useStageSelector';
import GroupChannel from './channels/GroupChannel';

/** *
 * The mixing panel shows all available volume controls for an active stage
 * @constructor
 */
const MixingPanelView = (): JSX.Element => {
  const groupIds = useStageSelector<string[]>((state) =>
    state.stageId ? state.groups.byStage[state.stageId] : []
  );

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        maxHeight: '600px',
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        padding: '1rem',
      }}
    >
      {groupIds.map((id) => (
        <GroupChannel key={id} groupId={id} />
      ))}
    </Flex>
  );
};
export default MixingPanelView;
