import {useAudioContext} from "../../../lib/useAudioContext";
import {useSelector} from "../../../lib/digitalstage/useStageContext/redux";
import {
    AudioConsumers,
    CustomGroups, CustomStageMembers,
    Groups,
    NormalizedState,
    StageMembers
} from "../../../lib/digitalstage/useStageContext/schema";
import React, {useEffect, useState} from "react";
import AudioConsumerPlayer from "./AudioConsumerPlayer";
import {IAudioContext, IGainNode} from "standardized-audio-context";

const useActualVolumes = () => {
    const audioConsumers = useSelector<NormalizedState, AudioConsumers>(state => state.audioConsumers);
    const groups = useSelector<NormalizedState, Groups>(state => state.groups);
    const stageMembers = useSelector<NormalizedState, StageMembers>(state => state.stageMembers);
    const customGroups = useSelector<NormalizedState, CustomGroups>(state => state.customGroups);
    const customStageMembers = useSelector<NormalizedState, CustomStageMembers>(state => state.customStageMembers);

    const [actualVolumes, setActualVolumes] = useState<{
        [audioConsumerId: string]: number
    }>({});

    useEffect(() => {
        audioConsumers.allIds.forEach(consumerId => {
            // Calculate volumes for consumer
            const consumer = audioConsumers.byId[consumerId];
            const stageMember = stageMembers.byId[consumer.stageMember];
            if (stageMember) {
                const stageMemberVolume: number = stageMember.volume;
                const groupVolume: number = groups.byId[stageMember.groupId].volume;
                const customGroupVolume: number | undefined = customGroups.byGroup[stageMember.groupId] ? customGroups.byId[customGroups.byGroup[stageMember.groupId]].volume : undefined;
                const customStageMemberVolume: number | undefined = customStageMembers.byStageMember[consumer.stageMember] ? customStageMembers.byId[customStageMembers.byStageMember[consumer.stageMember]].volume : undefined;
                const volume = (customGroupVolume ? customGroupVolume : groupVolume) * (customStageMemberVolume ? customStageMemberVolume : stageMemberVolume);
                console.log("Volume for " + consumerId + ": " + volume);
                setActualVolumes(prev => ({
                    ...prev,
                    [consumerId]: volume
                }));
            } else {
                console.error("FIXME: No stage member for audio consumer");
            }
        })
    }, [audioConsumers, groups, stageMembers, customGroups, customStageMembers]);

    return actualVolumes;
}

const AllAudioPlayer = () => {
    const {audioContext} = useAudioContext();
    const audioConsumers = useSelector<NormalizedState, AudioConsumers>(state => state.audioConsumers);
    const [monitorMixNode, setMonitorMixNode] = useState<IGainNode<IAudioContext>>();
    const [mixNode, setMixNode] = useState<IGainNode<IAudioContext>>();

    useEffect(() => {
        if (audioContext) {
            const monitorMixNode = audioContext.createGain();
            monitorMixNode.connect(audioContext.destination);
            monitorMixNode.gain.setValueAtTime(0, audioContext.currentTime);
            setMixNode(monitorMixNode);
            const mixNode = audioContext.createGain();
            mixNode.connect(audioContext.destination);
            mixNode.gain.setValueAtTime(1, audioContext.currentTime);
            setMixNode(mixNode);
            return () => {
                monitorMixNode.disconnect();
                setMonitorMixNode(undefined);
                mixNode.disconnect();
                setMixNode(undefined);
            }
        }
    }, [audioContext]);

    return (
        <>
            {audioConsumers.allIds.map(consumerId =>
                <AudioConsumerPlayer
                    key={consumerId}
                    destination={mixNode}
                    audioConsumer={audioConsumers.byId[consumerId]}
                />)}
        </>
    );
}
export default AllAudioPlayer;