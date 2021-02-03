/** @jsxRuntime classic */
/** @jsx jsx */
import {Flex, jsx} from 'theme-ui';
import {
    useAudioProducers,
    useCustomAudioProducers,
    useCustomGroups,
    useCustomStageMembers,
    useSelector,
    useStageActions,
    useStageMembers,
    useUsers,
} from '../../../lib/use-digital-stage';
import React from 'react';
import ChannelRow from "../ChannelRow";

const VariableMixingPanel = (props: { global: boolean }): JSX.Element => {
    const {global} = props;

    const {
        setCustomGroup,
        setCustomStageMember,
        setCustomStageMemberAudio,
        removeCustomGroup,
        removeCustomStageMember,
        removeCustomStageMemberAudio,
        updateStageMember,
        updateGroup,
        updateStageMemberAudio,
    } = useStageActions();

    // For groups
    const groups = useSelector((state) => {
        if (state.global.stageId && state.groups.byStage[state.global.stageId]) {
            return state.groups.byStage[state.global.stageId].map((id) => state.groups.byId[id]);
        }
        return [];
    });
    const customGroups = useCustomGroups();

    // For stage members
    const users = useUsers();
    const stageMembers = useStageMembers();
    const customStageMembers = useCustomStageMembers();

    // For audio producers
    const audioProducers = useAudioProducers();
    const customAudioProducers = useCustomAudioProducers();

    return (
        <Flex
            sx={{
                width: '100%'
            }}
        >
            {groups.map(group => {
                const customGroup = customGroups.byGroup[group._id]
                    ? customGroups.byId[customGroups.byGroup[group._id]]
                    : undefined;

                return (
                    <Flex
                        key={group._id}
                        sx={{
                            p: '4'
                        }}
                    >
                        <ChannelRow
                            key={group._id}
                            id={group._id}
                            name={group.name}
                            icon={<img src="/static/images/group.svg"/>}
                            channel={global
                                ? group
                                : customGroup || group}
                            colorized={true}
                            global={global}
                            resettable={(global && (group.volume !== 1 || group.muted)) || !!customGroup}
                            onReset={() => {
                                if (global) {
                                    updateGroup(group._id, {
                                        volume: 1,
                                        muted: false
                                    });
                                } else if (customGroup) {
                                    removeCustomGroup(customGroup._id)
                                }
                            }}
                            onChange={(volume, muted) => {
                                if (global) {
                                    updateGroup(group._id, {volume, muted})
                                } else {
                                    setCustomGroup(group._id, {volume, muted})
                                }
                            }}
                        >
                            {stageMembers.byGroup[group._id] && stageMembers.byGroup[group._id].map(id => stageMembers.byId[id]).map((stageMember, index, arr) => {
                                const user = users.byId[stageMember.userId];
                                const customStageMember = customStageMembers.byStageMember[stageMember._id]
                                    ? customStageMembers.byId[customStageMembers.byStageMember[stageMember._id]]
                                    : undefined;

                                return (
                                    <ChannelRow
                                        id={stageMember._id}
                                        key={stageMember._id}
                                        icon={<img src="/static/images/avatar.svg"/>}
                                        isLastChild={index === (arr.length - 1)}
                                        name={user.name}
                                        channel={global ? stageMember : customStageMember || stageMember}
                                        global={global}
                                        resettable={(global && (stageMember.volume !== 1 || stageMember.muted)) || !!customStageMember}
                                        onReset={() => {
                                            if (global) {
                                                updateStageMember(stageMember._id, {
                                                    volume: 1,
                                                    muted: false
                                                });
                                            } else if (customGroup) {
                                                removeCustomStageMember(customStageMember._id)
                                            }
                                        }}
                                        onChange={(volume, muted) => {
                                            if (!global) {
                                                setCustomStageMember(stageMember._id, {volume, muted})
                                            } else {
                                                updateStageMember(stageMember._id, {volume, muted})
                                            }
                                        }}
                                    >
                                        {audioProducers.byStageMember[stageMember._id] && audioProducers.byStageMember[stageMember._id].map(id => audioProducers.byId[id]).map((audioProducer, index, arr) => {
                                            const customAudioProducer = customAudioProducers.byAudioProducer[audioProducer._id]
                                                ? customAudioProducers.byId[customAudioProducers.byAudioProducer[audioProducer._id]]
                                                : undefined;

                                            return (
                                                <ChannelRow
                                                    id={audioProducer._id}
                                                    key={audioProducer._id}
                                                    icon={<img src="/static/images/track.svg"/>}
                                                    isLastChild={index === (arr.length - 1)}
                                                    name="Track"
                                                    channel={global ? audioProducer : customAudioProducer || audioProducer}
                                                    global={global}
                                                    resettable={(global && (audioProducer.volume !== 1 || audioProducer.muted)) || !!customAudioProducer}
                                                    onReset={() => {
                                                        if (global) {
                                                            updateStageMemberAudio(audioProducer._id, {
                                                                volume: 1,
                                                                muted: false
                                                            });
                                                        } else if (customGroup) {
                                                            removeCustomStageMemberAudio(customAudioProducer._id)
                                                        }
                                                    }}
                                                    onChange={(volume, muted) => {
                                                        if (!global) {
                                                            setCustomStageMemberAudio(audioProducer._id, {
                                                                volume,
                                                                muted
                                                            })
                                                        } else {
                                                            updateStageMemberAudio(audioProducer._id, {volume, muted})
                                                        }
                                                    }}
                                                />
                                            )
                                        })}
                                    </ChannelRow>
                                )
                            })}
                        </ChannelRow>
                    </Flex>
                )
            })}
        </Flex>
    );
};
export default VariableMixingPanel;