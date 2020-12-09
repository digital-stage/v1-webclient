/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Text } from 'theme-ui';
import { Group } from '../../lib/use-digital-stage/types';
import {
  useCurrentStageId,
  useGroupsByStage,
  useStageMembersByGroup,
} from '../../lib/use-digital-stage/hooks';
import StageMemberView from './StageMemberView';

const GroupView = ({ group }: { group: Group }): JSX.Element => {
  const stageMembers = useStageMembersByGroup(group._id);
  const stageId = useCurrentStageId();
  const groups = useGroupsByStage(stageId);

  return stageMembers.length > 0 ? (
    <Flex
      sx={{
        flexDirection: 'column',
        // maxWidth: ['100%', '100%'],
        width:
          groups.length === 2 ? ['100%', '46%'] : groups.length >= 3 ? ['100%', '30%'] : '100%',
        flexWrap: 'wrap',
        m: 2,
      }}
    >
      <Text variant="subTitle" sx={{ pl: 3, color: 'text' }}>
        {group.name}
      </Text>
      <Box sx={{ bg: 'primary', height: '2px', ml: 3, mr: 3 }}></Box>
      <Flex
        sx={{
          // maxWidth: '100%',
          // minWidth: '100%',
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
              width: stageMembers.length === 2 ? '100%' : stageMembers.length >= 2 ? '50%' : '100%',
              height:
                stageMembers.length === 2
                  ? 'calc(70vh / 2)'
                  : stageMembers.length >= 3
                  ? `calc(70vh / ${Math.round(stageMembers.length / 2)})`
                  : '70vh',
              p: '1px',
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
