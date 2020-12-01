/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { Box, Flex, jsx, Text } from 'theme-ui';
import GroupView from './GroupView';
import { useCurrentStageId, useGroupsByStage } from '../../lib/use-digital-stage';

const StageViewTest = (): JSX.Element => {
    const stageId = useCurrentStageId();
    const groups = useGroupsByStage(stageId);
    return (
        <Box sx={{ width: 'calc(100vw - 100px)', height: 'calc(100vh - 100px)', py: '50px', px: '50px', overflowY: 'auto' }}>
            <Flex sx={{ height: '100%', width: "100%", flexWrap: 'wrap' }}>
                {groups && groups.map((group) => {
                    return (
                        <Flex key={group._id} sx={{
                            flexDirection: 'column',
                            minWidth: '49%',
                            minHeight: '50%',
                            height:'50%'
                        }}>
                            <Text variant="subTitle" sx={{pl:3, color:'text'}}>{group.name}</Text>
                            <Box
                                sx={{
                                    bg: 'gray.7',
                                    p: 2,
                                    borderRadius: 'card',
                                    m: 1,
                                    borderTop: '1px solid #F20544',
                                }}
                            >
                                <GroupView key={group._id} group={group} />
                            </Box>
                        </Flex>
                    )
                })
                }
            </Flex>
        </Box>
    );
};

export default StageViewTest;
