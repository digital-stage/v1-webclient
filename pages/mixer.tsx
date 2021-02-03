import React from 'react';
import {useRouter} from 'next/router';
import useDigitalStage, {useSelector} from '../lib/use-digital-stage';
import {Box, Flex, Heading, jsx} from "theme-ui";
import ChannelRow from '../components/mixer/ChannelRow';
import ChannelStrip from '../components/mixer/ChannelStrip';


const Mixer = (): JSX.Element => {
    const router = useRouter();
    const {ready} = useDigitalStage();
    const stageId = useSelector<string>((state) => state.global.stageId);

    if (ready && !stageId) {
        router.push('/');
    }

    return (
        <Box
            sx={{
                display: 'inline-block',
                p: [0, 4],
                minHeight: '100vh',
                minWidth: '100%',
            }}
        >
            <Flex
                sx={{
                    flexDirection: 'column',
                    position: 'relative',
                    boxShadow: ['none', 'default'],
                    borderRadius: ['none', 'card'],
                    bg: 'gray.4',
                    p: [0, 4],
                    minHeight: '100vh',
                    minWidth: '100%',
                    maxHeight: ['100%', 'inherit']
                }}
            >
                <Heading sx={{
                    flexGrow: 0
                }}>
                    BLA
                </Heading>

                <Flex sx={{
                    flexGrow: 1,
                    flexWrap: ['nowrap', 'wrap'],
                    flexDirection: 'row',
                    alignItems: ['center'],
                    justifyContent: ['center', 'flex-start'],
                    height: ['100%', 'auto']
                }}>
                    <Flex
                        sx={{
                            minWidth: ['auto', '100%']
                        }}
                    >
                        <ChannelRow
                            sx={{
                                backgroundColor: '#121212',
                                border: '1px solid red',
                            }}
                        >
                            <ChannelStrip
                                name="Group 1"
                                elevation={4}
                                initialCollapse={window && window.innerWidth > 900}
                            >
                                <ChannelRow sx={{backgroundColor: '#1f1f1f'}}>
                                    <ChannelStrip name="Member" elevation={2}/>
                                    <ChannelStrip name="Member" elevation={2}/>
                                    <ChannelStrip name="Member" elevation={2}/>
                                    <ChannelStrip
                                        name="Member"
                                        elevation={2}>
                                        <ChannelRow sx={{backgroundColor: '#292929'}}>
                                            <ChannelStrip name="Track" elevation={1}/>
                                            <ChannelStrip name="Track" elevation={1}/>
                                            <ChannelStrip name="Track" elevation={1}/>
                                            <ChannelStrip name="Track" elevation={1}/>
                                            <ChannelStrip name="Track" elevation={1}/>
                                        </ChannelRow>
                                    </ChannelStrip>
                                    <ChannelStrip name="Member" elevation={2}/>
                                    <ChannelStrip name="Member" elevation={2}/>

                                    <ChannelStrip
                                        name="Member"
                                        elevation={2}>
                                        <ChannelRow sx={{backgroundColor: '#292929'}}>
                                            <ChannelStrip name="Track" elevation={1}/>
                                            <ChannelStrip name="Track" elevation={1}/>
                                            <ChannelStrip name="Track" elevation={1}/>
                                        </ChannelRow>
                                    </ChannelStrip>

                                </ChannelRow>
                            </ChannelStrip>
                        </ChannelRow>
                    </Flex>

                    <Flex
                        sx={{
                            minWidth: ['auto', '100%']
                        }}
                    >
                        <ChannelRow>
                            <ChannelStrip
                                name="Group 2"
                                elevation={3}
                                initialCollapse={window && window.innerWidth > 900}
                                sx={{
                                    backgroundColor: 'blue',
                                    border: '1px solid blue'
                                }}
                            >
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip
                                    name="Member"
                                    elevation={2}>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                </ChannelStrip>
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip
                                    name="Member"
                                    elevation={2}>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                </ChannelStrip>
                            </ChannelStrip>
                        </ChannelRow>
                    </Flex>
                    <Flex
                        sx={{
                        minWidth: ['auto', '100%']
                    }}
                        >
                        <ChannelRow>
                            <ChannelStrip
                                name="Group 3"
                                elevation={3}
                            >
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip
                                    name="Member"
                                    elevation={2}>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                </ChannelStrip>
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip name="Member" elevation={2}/>
                                <ChannelStrip
                                    name="Member"
                                    elevation={2}>
                                    <ChannelStrip name="Track" elevation={1}/>
                                    <ChannelStrip name="Track" elevation={1}/>
                                </ChannelStrip>
                            </ChannelStrip>
                        </ChannelRow>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
};
export default Mixer;
