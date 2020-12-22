import React from 'react';
import { useSelector } from '../../../lib/use-digital-stage/hooks';
import { Flex } from 'theme-ui';
import GroupChannel from './channels/GroupChannel';

/** *
 * The mixing panel shows all available volume controls for an active stage
 * @constructor
 */
const MixingPanel = (props: { globalMode: boolean }): JSX.Element => {
  const groupIds = useSelector<string[]>((state) =>
    state.global.stageId && state.groups.byStage[state.global.stageId]
      ? state.groups.byStage[state.global.stageId]
      : []
  );

  return (
    <Flex
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        minHeight: '500px',
        maxHeight: '800px',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        p: 5,
        overflowX: 'scroll',
        overflowY: 'auto',
        '::-webkit-scrollbar': {
          width: '5px',
          bg: 'transparent',
        },
        '::-webkit-scrollbar-track': {
          bg: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          bg: 'gray.3',
          borderRadius: 'card',
        },
      }}
    >
      {groupIds.map((id) => (
        <GroupChannel key={id} groupId={id} globalMode={props.globalMode} />
      ))}
    </Flex>
  );
};
export default MixingPanel;
