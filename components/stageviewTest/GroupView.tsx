/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Text } from 'theme-ui';
import { Group } from '../../lib/use-digital-stage/types';
import { useStageMembersByGroup } from '../../lib/use-digital-stage/hooks';
import StageMemberView from './StageMemberView';

const GroupView = ({ group }: { group: Group }): JSX.Element => {
  const stageMembers = useStageMembersByGroup(group._id);

  return stageMembers.length > 0 ? (
    <Flex
      sx={{
        flexDirection: 'column',
        maxWidth: ['100%', '50%'],
        minWidth: ['100%', '50%'],
        flexWrap: 'wrap',
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
            sx={{
              maxWidth: '50%',
              minWidth: '50%',
            }}
          >
            <StageMemberView stageMember={stageMember} />
          </Flex>
        ))}
      </Flex>
    </Flex>
  ) : null;
};

export default GroupView;
