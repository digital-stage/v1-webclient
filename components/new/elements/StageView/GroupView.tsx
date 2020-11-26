/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Heading, Box } from 'theme-ui';
import StageMemberView from './StageMemberView';
import { Group } from '../../../../lib/use-digital-stage/types';
import { useStageMembersByGroup } from '../../../../lib/use-digital-stage/hooks';

const GroupView = ({ group }: { group: Group }): JSX.Element => {
  const stageMembers = useStageMembersByGroup(group._id);

  if (stageMembers.length > 0) {
    return (
      <Box sx={{ bg: 'gray.7', borderRadius: 'card', m: 3 }}>
        <Heading as="h2" sx={{ color: 'gray.1', ml: 3, py: 3 }}>
          {group.name}
        </Heading>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: [
              'repeat(1,1fr)',
              'repeat(3,1fr)',
              'repeat(4,1fr)',
              'repeat(6,1fr)',
            ],
            gridGap: 2,
          }}
        >
          {stageMembers.map((stageMember) => (
            <StageMemberView key={stageMember._id} stageMember={stageMember} />
          ))}
        </Box>
      </Box>
    );
  }
  return null;
};

export default GroupView;
