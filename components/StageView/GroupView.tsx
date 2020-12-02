/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Text } from 'theme-ui';
import { Group } from '../../lib/use-digital-stage/types';
import { useStageMembersByGroup } from '../../lib/use-digital-stage/hooks';
import StageMemberView from './StageMemberView';

const GroupView = ({ group }: { group: Group }): JSX.Element => {
  const stageMembers = useStageMembersByGroup(group._id);
  console.log('stage memebers', stageMembers)

  return stageMembers.length > 0 ? (
    <Flex
      sx={{
        flexDirection: 'column',
        maxWidth: ['100%', '46%'],
        flexWrap: 'wrap',
        m:2
      }}
    >
      <Text variant="subTitle" sx={{ pl: 3, color: 'text' }}>
        {group.name}
      </Text>
      <Box sx={{ bg: 'primary', height: '2px', ml: 3, mr: 3 }}></Box>
      <Flex
        sx={{
          maxWidth: '100%',
          minWidth: '100%',
          flexWrap: 'wrap',
          bg: 'gray.7',
          borderRadius: 'card',
          p: 2,
        }}
      >
        {stageMembers.map((stageMember) => (
          <Flex
            key={stageMember._id}
          >
            <StageMemberView stageMember={stageMember} />
          </Flex>
        ))}
      </Flex>
    </Flex>
  ) : null;
};

export default GroupView;
