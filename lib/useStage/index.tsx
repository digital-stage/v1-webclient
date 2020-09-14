import React, {useCallback, useEffect, useState} from "react";
import Client from "../useSocket/model.client";
import {
    CustomGroupVolumeId,
    CustomStageMemberVolumeId,
    GroupId,
    Producer,
    StageMemberId
} from "../useSocket/model.common";
import {useDevices} from "../useDevices";
import {ServerStageEvents} from "../useSocket/events";


export interface StageProps {
    stage: Client.Stage;
    stageId: string;

    setCustomGroupVolume(groupId: GroupId, volume: number);

    setCustomGroupMemberVolume(id: StageMemberId, volume: number);
}

const StageContext = React.createContext<StageProps>(undefined);

export const useStage = (): StageProps => React.useContext<StageProps>(StageContext);


let isSocketInitialized = false;
export const StageContextProvider = (props: {
    children: React.ReactNode
}) => {
    const {socket} = useDevices();
    const [stageId, setStageId] = useState<string>();
    const [stage, setStage] = useState<Client.Stage>();

    const [stagePrototype, setStagePrototype] = useState<Client.StagePrototype>();
    const [groupPrototypes, setGroupPrototypes] = useState<Client.GroupPrototype[]>([]);
    const [groupMemberPrototypes, setGroupMemberPrototypes] = useState<Client.GroupMemberPrototype[]>([]);
    const [customGroupVolumes, setCustomGroupVolumes] = useState<Client.CustomGroupVolume[]>([]);
    const [customStageMemberVolumes, setCustomStageMemberVolumes] = useState<Client.CustomStageMemberVolume[]>([]);
    const [producerPrototypes, setProducerPrototypes] = useState<Producer[]>();

    useEffect(() => {
        if (stageId && stagePrototype) {
            const stage: Client.Stage = {
                ...stagePrototype,
                groups: groupPrototypes.filter(groupPrototype => groupPrototype.stageId === stagePrototype._id)
                    .map(groupPrototype => ({
                        ...groupPrototype,
                        customVolume: customGroupVolumes.find(customGroupVolume => customGroupVolume.groupId === groupPrototype._id).volume,
                        members: groupMemberPrototypes.filter(groupMemberPrototype => groupMemberPrototype.groupId === groupPrototype._id)
                            .map(groupMemberPrototype => ({
                                ...groupMemberPrototype,
                                customVolume: customStageMemberVolumes.find(customStageMemberVolume => customStageMemberVolume.stageMemberId === groupMemberPrototype._id).volume,
                                audioProducers: producerPrototypes.filter(producerPrototype => producerPrototype.kind === "audio" && producerPrototype.userId === groupMemberPrototype.userId),
                                videoProducers: producerPrototypes.filter(producerPrototype => producerPrototype.kind === "video" && producerPrototype.userId === groupMemberPrototype.userId),
                                ovProducers: producerPrototypes.filter(producerPrototype => producerPrototype.kind === "ov" && producerPrototype.userId === groupMemberPrototype.userId)
                            }))
                    }))
            }
            setStage(stage);
        } else {
            setStage(undefined);
        }
    }, [stageId, stagePrototype, groupPrototypes, groupMemberPrototypes, customStageMemberVolumes, customGroupVolumes, producerPrototypes]);

    useEffect(() => {
        if (socket) {
            console.log("useStage: socket changed");
            console.log("Register stage changes");
            socket.on(ServerStageEvents.STAGE_ADDED, (stage: Client.StagePrototype) => {
                console.log("stage-added");
                console.log(stage);
                setStagePrototype(prevState => stageId === stage._id ? stage : prevState);
            });
            socket.on(ServerStageEvents.STAGE_CHANGED, (stage: Client.StagePrototype) => {
                console.log("stage-changed");
                console.log(stage);
                setStagePrototype(prevState => stageId === stage._id ? {...prevState, ...stage} : prevState);
            });
            socket.on(ServerStageEvents.STAGE_REMOVED, (stageId: string) => {
                console.log("stage-removed");
                console.log(stageId);
                setStagePrototype(prevState => {
                    if (stage && stage._id === stageId) {
                        setStageId(undefined);
                        setStage(undefined);
                        setGroupPrototypes([]);
                        setGroupMemberPrototypes([]);
                        setCustomGroupVolumes([]);
                        setCustomStageMemberVolumes([]);
                        return undefined;
                    }
                    return prevState;
                });
            });
            socket.on(ServerStageEvents.GROUP_ADDED, (group: Client.GroupPrototype) => {
                console.log("group-added");
                console.log(group);
                setGroupPrototypes(prevState => group.stageId === stageId ? [...prevState, group] : prevState);
            });
            socket.on(ServerStageEvents.GROUP_CHANGED, (group: Client.StageMemberPrototype) => {
                console.log("group-changed");
                console.log(group);
                setGroupPrototypes(prevState => group.stageId === stageId ? prevState.map(s => s._id === group._id ? {...s, ...group} : s) : prevState);
            });
            socket.on(ServerStageEvents.GROUP_REMOVED, (groupId: string) => {
                console.log("group-removed");
                console.log(groupId);
                setGroupPrototypes(prevState => prevState.filter(group => group._id !== groupId));
            });
            socket.on(ServerStageEvents.GROUP_MEMBER_ADDED, (stageMember: Client.GroupMemberPrototype) => {
                console.log("stage-member-added");
                console.log(stageMember);
                setGroupMemberPrototypes(prevState => stageMember.stageId === stageId ? [...prevState, stageMember] : prevState);
            });
            socket.on(ServerStageEvents.GROUP_MEMBER_CHANGED, (stageMember: Client.GroupMemberPrototype) => {
                console.log("stage-member-changed");
                console.log(stageMember);
                setGroupMemberPrototypes(prevState => stageMember.stageId === stageId ? prevState.map(s => s._id === stageMember._id ? {...s, ...stageMember} : s) : prevState);
            });
            socket.on(ServerStageEvents.GROUP_MEMBER_REMOVED, (stageMemberId: string) => {
                console.log("stage-member-removed");
                console.log(stageMemberId);
                setGroupMemberPrototypes(prevState => prevState.filter(stageMember => stageMember._id !== stageMemberId));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_ADDED, (customGroupVolume: Client.CustomGroupVolume) => {
                console.log("custom-group-volume-added");
                console.log(customGroupVolume);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomGroupVolumes(prevState => [...prevState, customGroupVolume]);
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_CHANGED, (customGroupVolume: Client.CustomGroupVolume) => {
                console.log("custom-group-volume-changed");
                console.log(customGroupVolume);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomGroupVolumes(prevState => prevState.map(s => s._id === customGroupVolume._id ? {...s, ...customGroupVolume} : s));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_REMOVED, (id: CustomGroupVolumeId) => {
                console.log("custom-group-volume-removed");
                console.log(id);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomGroupVolumes(prevState => prevState.filter(customGroupVolume => customGroupVolume._id !== id));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_MEMBER_VOLUME_ADDED, (customStageMemberVolume: Client.CustomStageMemberVolume) => {
                console.log("custom-stage-member-volume-added");
                console.log(customStageMemberVolume);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomStageMemberVolumes(prevState => [...prevState, customStageMemberVolume]);
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_MEMBER_CHANGED, (customStageMemberVolume: Client.CustomStageMemberVolume) => {
                console.log("custom-stage-member-volume-changed");
                console.log(customStageMemberVolume);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomStageMemberVolumes(prevState => prevState.map(s => s._id === customStageMemberVolume._id ? {...s, ...customStageMemberVolume} : s));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_MEMBER_REMOVED, (id: CustomStageMemberVolumeId) => {
                console.log("custom-stage-member-volume-removed");
                console.log(id);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomStageMemberVolumes(prevState => prevState.filter(customStageMemberVolume => customStageMemberVolume._id !== id));
            });
            socket.on(ServerStageEvents.PRODUCER_ADDED, (producer: Producer) => {
                console.log("producer-added");
                console.log(producer);
                // We don't need to filter by stage, since volumes are send for active stages only
                setProducerPrototypes(prevState => [...prevState, producer])
            });
            socket.on(ServerStageEvents.PRODUCER_CHANGED, (producer: Producer) => {
                console.log("producer-changed");
                console.log(producer);
                // We don't need to filter by stage, since volumes are send for active stages only
                setProducerPrototypes(prevState => prevState.map(p => p._id === producer._id ? {...p, ...producer} : p));
            });
            socket.on(ServerStageEvents.PRODUCER_REMOVED, (producerId: string) => {
                console.log("producer-removed");
                console.log(producerId);
                // We don't need to filter by stage, since volumes are send for active stages only
                setProducerPrototypes(prevState => prevState.filter(producer => producer._id !== producerId));
            });
            socket.on("disconnect", () => {
                setStage(undefined);
                setStageId(undefined);
                setStagePrototype(undefined);
                setGroupPrototypes([]);
                setGroupMemberPrototypes([]);
                setProducerPrototypes([]);
                setCustomStageMemberVolumes([]);
                setCustomGroupVolumes([]);
            })
            isSocketInitialized = true;
        }
    }, [socket]);

    const setCustomGroupVolume = useCallback((id: string, volume: number) => {
        if (socket) {
            socket.emit("set-custom-group-volume", {
                id: id,
                volume: volume
            });
        }
    }, [socket]);

    const setCustomGroupMemberVolume = useCallback((id: string, volume: number) => {
        if (socket) {
            socket.emit("set-custom-stage-member-volume", {
                id: id,
                volume: volume
            });
        }
    }, [socket]);

    return (
        <StageContext.Provider value={{
            stage: stage,
            stageId: stageId,
            setCustomGroupVolume: setCustomGroupVolume,
            setCustomGroupMemberVolume: setCustomGroupMemberVolume
        }}>
            {props.children}
        </StageContext.Provider>
    )
}