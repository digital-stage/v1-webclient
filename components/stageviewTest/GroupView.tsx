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
      key={group._id}
      sx={{
        flexDirection: 'column',
        minWidth: ['100%', '50%'],
        minHeight: ['80%', '50%'],
        height: ['80%', '50%'],
      }}
    >
      <Text variant="subTitle" sx={{ pl: 3, color: 'text' }}>
        {group.name}
      </Text>
      <Box sx={{ bg: 'primary', height: '2px', ml: 3, mr: 3 }}></Box>
      <Box
        sx={{
          bg: 'gray.7',
          borderRadius: 'card',
          p: 2,
          height: '100%',
        }}
      >
        <Flex sx={{ height: '100%', width: '100%', flexWrap: 'wrap' }}>
          <Box sx={{ minWidth: '50%', minHeight: 'auto' }}>
            {stageMembers.map((stageMember) => (
              <StageMemberView key={stageMember._id} stageMember={stageMember} />
            ))}
          </Box>
        </Flex>
      </Box>
    </Flex>
  ) : null;
};

export default GroupView;
