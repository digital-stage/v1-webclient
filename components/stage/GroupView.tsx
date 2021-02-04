/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import {jsx, Box, Flex, Text} from 'theme-ui';
import {Group} from '../../lib/use-digital-stage';
import {
    useCurrentStageId,
    useGroupsByStage,
    useStageMembersByGroup,
} from '../../lib/use-digital-stage/hooks';
import StageMemberView from './StageMemberView';
import useColors from "../../lib/useColors";

const GroupView = ({group}: { group: Group }): JSX.Element => {
    const stageMembers = useStageMembersByGroup(group._id);
    const stageId = useCurrentStageId();
    const groups = useGroupsByStage(stageId);
    const onlineMembers = stageMembers.filter((member) => member.online);
    const groupsWithMembers = groups.filter(
        (group) => useStageMembersByGroup(group._id).filter((member) => member.online).length > 0
    );
    const getColor = useColors();
    const color = getColor(group._id).toProperty();

    return onlineMembers.length > 0 ? (
        <Flex
            sx={{
                flexDirection: 'column',
                width:
                    groupsWithMembers.length === 2
                        ? ['100%', '50%']
                        : groupsWithMembers.length >= 3
                        ? ['100%', '50%', '33%', '25%']
                        : '100%',
                flexWrap: 'wrap',
                p: 4,
            }}
        >
            <Text variant="subTitle" sx={{
                pl: 4,
                color: 'text'
            }}>
                {group.name}
            </Text>
            <Box sx={{
                backgroundColor: color,
                height: '2px',
                ml: 4,
                mr: 4
            }}/>
            <Flex
                sx={{
                    flexWrap: 'wrap',
                    bg: 'gray.7',
                    borderRadius: 'card',
                    p: 3,
                }}
            >
                {onlineMembers.map((stageMember) => (
                    <Flex
                        key={stageMember._id}
                        sx={{
                            width:
                                onlineMembers.length === 2 ? '100%' : onlineMembers.length >= 2 ? '50%' : '100%',
                            height:
                                onlineMembers.length === 2
                                    ? 'calc((100vh - 190px) / 2)'
                                    : onlineMembers.length >= 3
                                    ? `calc((100vh - 190px) / ${Math.round(onlineMembers.length / 2)})`
                                    : 'calc(100vh - 190px)',
                            p: '1px',
                        }}
                    >
                        <StageMemberView stageMember={stageMember}/>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    ) : null;
};

export default GroupView;
