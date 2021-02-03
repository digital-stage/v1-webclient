/** @jsxRuntime classic */
/** @jsx jsx */
import React, {useState} from "react";
import {Flex, Heading, SxStyleProp, jsx, IconButton} from "theme-ui";
import VolumeSlider from "../VolumeSlider";
import {ThreeDimensionAudioProperties} from "../../../lib/use-digital-stage";
import {IAnalyserNode, IAudioContext} from "standardized-audio-context";
import {BiChevronLeft, BiChevronRight} from "react-icons/bi";

const CHANNEL_PADDING_REM = .2;

const ChannelStrip = (props: {
    children?: React.ReactNode,
    name: string,
    elevation?: number,
    sx?: SxStyleProp,
    initialCollapse?: boolean,
    icon?: React.ReactNode,

    channel: ThreeDimensionAudioProperties;
    onChange: (volume: number, muted: boolean) => void;
    global?: boolean;

    resettable?: boolean;
    onReset?: () => void;
    analyserL?: IAnalyserNode<IAudioContext>;
    analyserR?: IAnalyserNode<IAudioContext>;
}): JSX.Element => {
    const {children, name, elevation, sx, initialCollapse, icon} = props;
    const [collapsed, setCollapsed] = useState<boolean>(initialCollapse);
    const hasChildren = React.Children.count(children) > 0;
    return (
        <Flex
            sx={{
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                borderRadius: 'card',
                minHeight: '100%',
                ...sx
            }}
        >
            <Flex
                sx={{
                    width: '200px',
                    flexDirection: 'column',
                    padding: elevation * CHANNEL_PADDING_REM * 2 + "rem",
                }}
            >
                {icon ? (
                    <React.Fragment>
                        <Flex
                            sx={{
                                width: '100%',
                                flexGrow: 0,
                                cursor: hasChildren && "pointer"
                            }}
                            onClick={() => hasChildren && setCollapsed(prev => !prev)}
                        >
                            {icon}
                            {hasChildren && (
                                <IconButton
                                    variant='icon'
                                >
                                    {collapsed ? <BiChevronLeft size="24px"/> : <BiChevronRight size={24}/>}
                                </IconButton>
                            )}
                        </Flex>
                        <Heading
                            variant="h4"
                            sx={{
                                flexGrow: 1,
                                py: 4,
                            }}
                        >
                            {name}
                        </Heading>
                    </React.Fragment>
                ) : (
                    <Flex
                        sx={{
                            width: '100%',
                            flexGrow: 0,
                            cursor: hasChildren && "pointer"
                        }}
                        onClick={() => hasChildren && setCollapsed(prev => !prev)}
                    >
                        <Heading
                            variant="h4"
                            sx={{
                                flexGrow: 1,
                                py: 4,
                            }}
                        >
                            {name}
                        </Heading>
                        {hasChildren && (
                            <IconButton
                                variant='icon'
                            >
                                {collapsed ? <BiChevronLeft size="24px"/> : <BiChevronRight size={24}/>}
                            </IconButton>
                        )}
                    </Flex>
                )}
                <Flex sx={{
                    justifySelf: 'flex-end',
                }}>
                    <VolumeSlider min={0} middle={1} max={4} value={2} onChange={() => {
                    }} color={"#fff"}/>
                </Flex>
            </Flex>
            {hasChildren && collapsed && (
                <Flex
                    sx={{
                        padding: elevation * CHANNEL_PADDING_REM + "rem",
                    }}
                >
                    {children}
                </Flex>
            )}
        </Flex>
    )
}
export default ChannelStrip;