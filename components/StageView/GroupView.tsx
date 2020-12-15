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
        width:
          groups.length === 2
            ? ['100%', '50%']
            : groups.length >= 3
            ? ['100%', '50%', '50%', '33%']
            : '100%',
        flexWrap: 'wrap',
        p: 4,
      }}
    >
      <Text variant="subTitle" sx={{ pl: 4, color: 'text' }}>
        {group.name}
      </Text>
      <Box sx={{ bg: 'secondary', height: '2px', ml: 4, mr: 4 }}></Box>
      <Flex
        sx={{
          flexWrap: 'wrap',
          bg: 'gray.7',
          borderRadius: 'card',
          p: 3,
        }}
      >
        {stageMembers.map((stageMember) => (
          <Flex
            key={stageMember._id}
            sx={{
              width: stageMembers.length === 2 ? '100%' : stageMembers.length >= 2 ? '50%' : '100%',
              height:
                stageMembers.length === 2
                  ? 'calc((100vh - 190px) / 2)'
                  : stageMembers.length >= 3
                  ? `calc((100vh - 190px) / ${Math.round(stageMembers.length / 2)})`
                  : 'calc(100vh - 190px)',
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
