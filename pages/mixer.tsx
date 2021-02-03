import React from 'react';
import {useRouter} from 'next/router';
import useDigitalStage, {useSelector} from '../lib/use-digital-stage';
import MixingPanel from '../components/mixer/MixingPanel';
import {Box, Flex, Heading} from "theme-ui";

const ChannelStrip = (props: {children: React.ReactNode}): JSX.Element => {
    const {children} = props;
    return (
        <Flex
        sx={{
            width: '500px',
            border: '1px solid red',
        }}
        >
            {children}
        </Flex>
    )
}

const ChannelRow = (props: {children: React.ReactNode}): JSX.Element => {
    const {children} = props;
    return (
        <Flex
            sx={{
                flexDirection: 'row',
                flexWrap: ['nowrap', 'wrap'],
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                flexGrow: 1,
                height: '100%',
                minHeight: '400px',
                maxHeight: '600px',
            }}
        >
            {children}
        </Flex>
    )
}

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
                minHeight: '100%',
                p: 4
            }}
        >ERROR
            <Box
                sx={{
                    boxShadow: ['none', 'default'],
                    borderRadius: ['none', 'card'],
                    bg: 'gray.4',
                    p: 4,
                    minWidth: '100%',
                    minHeight: '100%',
                }}
            >
                <Heading>
                    BLA
                </Heading>

                <Box
                    sx={{
                        height: '3000px',
                        width: '4000px',
                        backgroundColor: 'blue',
                    }}>
                    HALLO
                </Box>

                <Flex
                sx={{
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    flexGrow: 1,
                }}
                >
                    <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'scroll',
                        backgroundColor: 'red'
                    }}
                    >
                        <ChannelRow>
                            <ChannelStrip>
                                ROW
                            </ChannelStrip>

                            <ChannelStrip>
                                ROW
                            </ChannelStrip>

                            <ChannelStrip>
                                ROW
                            </ChannelStrip>



                            <ChannelStrip>
                                ROW
                            </ChannelStrip>



                            <ChannelStrip>
                                ROW
                            </ChannelStrip>



                            <ChannelStrip>
                                ROW
                            </ChannelStrip>



                            <ChannelStrip>
                                ROW
                            </ChannelStrip>



                            <ChannelStrip>
                                ROW
                            </ChannelStrip>

                        </ChannelRow>

                    </Box>

                </Flex>
            </Box>
        </Box>
    );
};
export default Mixer;
