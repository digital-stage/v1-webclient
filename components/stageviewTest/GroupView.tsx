/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import { Group, useStageMembersByGroup } from '../../lib/use-digital-stage';
import StageMemberView from './StageMemberView';

const GroupView = ({ group }: { group: Group }): JSX.Element => {
  const stageMembers = useStageMembersByGroup(group._id);
  console.log(stageMembers.length)
  if (stageMembers.length > 0) {
    return (
      <Flex sx={{ height: '100%', width: "100%", flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: '50%', minHeight: 'auto' }}>{
          stageMembers.map((stageMember) => (
            <StageMemberView key={stageMember._id} stageMember={stageMember} />
          ))
        }</Box>
      </Flex>
    );
  }
  return null;
};

export default GroupView;
