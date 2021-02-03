/** @jsxRuntime classic */
/** @jsx jsx */
import {Flex, Heading, IconButton, jsx} from 'theme-ui';
import useStageWebAudio from '../../../../lib/useStageWebAudio';
import useColors from '../../../../lib/useColors';
import {CustomGroup, Group} from '../../../../lib/use-digital-stage';
import ChannelStrip from "../../old/ChannelStrip";
import React, {useState} from "react";
import {BiChevronLeft, BiChevronRight} from 'react-icons/bi';

const GroupRow = (props: {
    group: Group;
    customGroup?: CustomGroup;
    onChange: (volume: number, muted: boolean) => void;
    children?: React.ReactNode;
    resettable?: boolean;
    global?: boolean;
    onReset?: () => void;
}): JSX.Element => {
    const {group, customGroup, onChange, children, resettable, onReset, global} = props;
    const {byGroup} = useStageWebAudio();
    const color = useColors(group._id);
    const [collapsed, setCollapsed] = useState<boolean>(false);

    return (
        <Flex
            sx={{
                flexDirection: 'row',
                bg: 'gray.7',
                borderRadius: 'card',
                p: '2'
            }}
        >
            <Flex
                sx={{
                    flexDirection: 'column'
                }}
            >
                <Flex
                    onClick={(e) => {
                        e.preventDefault();
                        setCollapsed(prev => !prev);
                    }}
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        userSelect: 'none',
                        cursor: 'pointer',
                        flexGrow: 0
                    }}
                >
                    <Heading
                        variant="h4"
                    >
                        {group.name}
                    </Heading>
                    <IconButton variant='icon'>
                        {collapsed ? <BiChevronLeft size={12}/> : <BiChevronRight size={12}/>}
                    </IconButton>
                </Flex>
                <ChannelStrip
                    muted={customGroup? customGroup.muted : group.muted}
                    volume={customGroup? customGroup.volume : group.volume}
                    analyserL={byGroup && byGroup[group._id] && byGroup[group._id].analyserNodeL}
                    analyserR={byGroup && byGroup[group._id] && byGroup[group._id].analyserNodeR}
                    onVolumeChanged={onChange}
                    onReset={onReset}
                    resettable={resettable}
                    global={global}
                    sx={{
                        height: '100%',
                        width: '150px',
                        flexGrow: 1
                    }}
                />
            </Flex>

            <Flex>
                {children}
            </Flex>
        </Flex>
    );
};
export default GroupRow;
