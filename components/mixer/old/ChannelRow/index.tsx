/** @jsxRuntime classic */
/** @jsx jsx */
import {Flex, Heading, IconButton, jsx, SxStyleProp} from 'theme-ui';
import React, {useState} from "react";
import {BiChevronLeft, BiChevronRight} from 'react-icons/bi';
import {ThreeDimensionAudioProperties} from "../../../../lib/use-digital-stage";
import useColors from "../../../../lib/useColors";
import ChannelStrip from "../ChannelStrip";
import {IAnalyserNode, IAudioContext} from "standardized-audio-context";

const ChannelRow = (props: {
    name: string;
    channel: ThreeDimensionAudioProperties;
    onChange: (volume: number, muted: boolean) => void;
    icon?: React.ReactNode;
    color?: string;
    children?: React.ReactNode;
    global?: boolean;
    resettable?: boolean;
    onReset?: () => void;
    analyserL?: IAnalyserNode<IAudioContext>;
    analyserR?: IAnalyserNode<IAudioContext>;
    sx?: SxStyleProp;

    isLastChild?: boolean;
}): JSX.Element => {
    const {
        sx,
        color,
        channel,
        name,
        icon,
        onChange,
        children,
        resettable,
        onReset,
        global,
        analyserL,
        analyserR,
    } = props;
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const hasChildren = React.Children.count(children) > 0;

    return (
        <Flex
            sx={{

                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                bg: 'gray.7',
                border: color && "1px solid " + color,
                borderRadius: 'card',
                p: 4
            }}
        >
            <Flex
                sx={{
                    flexDirection: 'column',
                    ...sx,
                }}
            >
                <Flex
                    onClick={(e) => {
                        e.preventDefault();
                        if (hasChildren)
                            setCollapsed(prev => !prev);
                    }}
                    sx={{
                        pl: 7,
                        pr: !hasChildren && 7,
                        alignItems: 'center',
                        userSelect: 'none',
                        cursor: 'pointer',
                        flexGrow: 0
                    }}
                >
                    {icon
                        ? <Flex
                            sx={{
                                borderRadius: '50%',
                                backgroundColor: color
                            }}>{icon}</Flex>
                        : (
                            <Heading
                                variant="h4"
                            >
                                {name}
                            </Heading>
                        )}

                    {hasChildren && (
                        <IconButton
                            variant='icon'
                        >
                            {collapsed ? <BiChevronLeft size="24px"/> : <BiChevronRight size={24}/>}
                        </IconButton>
                    )}
                </Flex>
                {icon && (
                    <Heading
                        sx={{
                            width: '100%',
                            flexGrow: 1,
                            py: 5,
                            color: resettable
                                ? global
                                    ? 'gray.1'
                                    : 'primary'
                                : 'gray.3'
                        }}
                        variant="body"
                    >
                        {name}
                    </Heading>
                )}
                <ChannelStrip
                    muted={channel.muted}
                    volume={channel.volume}
                    analyserL={analyserL}
                    analyserR={analyserR}
                    onVolumeChanged={onChange}
                    onReset={onReset}
                    resettable={resettable}
                    global={global}
                />
            </Flex>

            {collapsed && (
                <Flex>
                    {children}
                </Flex>
            )}
        </Flex>
    );
};
export default ChannelRow;
