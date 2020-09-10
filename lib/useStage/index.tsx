import React, {useCallback, useEffect, useState} from "react";
import {useSocket} from "../useSocket";
import Client from "../useSocket/model.client";
import {
    CustomGroupVolumeId,
    CustomStageMemberVolumeId,
    GroupId,
    Producer,
    StageMemberId
} from "../useSocket/model.common";


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
    const socket = useSocket();
    const [stageId, setStageId] = useState<string>();
    const [stage, setStage] = useState<Client.Stage>();

    const [stagePrototype, setStagePrototype] = useState<Client.StagePrototype>();
    const [groupPrototypes, setGroupPrototypes] = useState<Client.GroupPrototype[]>([]);
    const [stageMemberPrototypes, setStageMemberPrototypes] = useState<Client.StageMemberPrototype[]>([]);
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
                        members: stageMemberPrototypes.filter(stageMemberPrototype => stageMemberPrototype.groupId === groupPrototype._id)
                            .map(stageMemberPrototype => ({
                                ...stageMemberPrototype,
                                customVolume: customStageMemberVolumes.find(customStageMemberVolume => customStageMemberVolume.stageMemberId === stageMemberPrototype._id).volume,
                                audioProducers: producerPrototypes.filter(producerPrototype => producerPrototype.kind === "audio" && producerPrototype.userId === stageMemberPrototype.userId),
                                videoProducers: producerPrototypes.filter(producerPrototype => producerPrototype.kind === "video" && producerPrototype.userId === stageMemberPrototype.userId),
                                ovProducers: producerPrototypes.filter(producerPrototype => producerPrototype.kind === "ov" && producerPrototype.userId === stageMemberPrototype.userId)
                            }))
                    }))
            }
            setStage(stage);
        } else {
            setStage(undefined);
        }
    }, [stageId, stagePrototype, groupPrototypes, stageMemberPrototypes, customStageMemberVolumes, customGroupVolumes, producerPrototypes]);

    useEffect(() => {
        if (socket) {
            console.log("useStage: socket changed");
            console.log("Register stage changes");
            socket.on("stage-added", (stage: Client.StagePrototype) => {
                console.log("stage-added");
                console.log(stage);
                setStagePrototype(prevState => stageId === stage._id ? stage : prevState);
            });
            socket.on("stage-changed", (stage: Client.StagePrototype) => {
                console.log("stage-changed");
                console.log(stage);
                setStagePrototype(prevState => stageId === stage._id ? {...prevState, ...stage} : prevState);
            });
            socket.on("stage-removed", (stageId: string) => {
                console.log("stage-removed");
                console.log(stageId);
                setStagePrototype(prevState => {
                    if (stage._id === stageId) {
                        setStageId(undefined);
                        setStage(undefined);
                        setGroupPrototypes([]);
                        setStageMemberPrototypes([]);
                        setCustomGroupVolumes([]);
                        setCustomStageMemberVolumes([]);
                        return undefined;
                    }
                    return prevState;
                });
            });
            socket.on("group-added", (group: Client.GroupPrototype) => {
                console.log("group-added");
                console.log(group);
                setGroupPrototypes(prevState => group.stageId === stageId ? [...prevState, group] : prevState);
            });
            socket.on("group-changed", (group: Client.StageMemberPrototype) => {
                console.log("group-changed");
                console.log(group);
                setGroupPrototypes(prevState => group.stageId === stageId ? prevState.map(s => s._id === group._id ? {...s, ...group} : s) : prevState);
            });
            socket.on("group-removed", (groupId: string) => {
                console.log("group-removed");
                console.log(groupId);
                setGroupPrototypes(prevState => prevState.filter(group => group._id !== groupId));
            });
            socket.on("stage-member-added", (stageMember: Client.StageMemberPrototype) => {
                console.log("stage-member-added");
                console.log(stageMember);
                setStageMemberPrototypes(prevState => stageMember.stageId === stageId ? [...prevState, stageMember] : prevState);
            });
            socket.on("stage-member-changed", (stageMember: Client.StageMemberPrototype) => {
                console.log("stage-member-changed");
                console.log(stageMember);
                setStageMemberPrototypes(prevState => stageMember.stageId === stageId ? prevState.map(s => s._id === stageMember._id ? {...s, ...stageMember} : s) : prevState);
            });
            socket.on("stage-member-removed", (stageMemberId: string) => {
                console.log("stage-member-removed");
                console.log(stageMemberId);
                setStageMemberPrototypes(prevState => prevState.filter(stageMember => stageMember._id !== stageMemberId));
            });
            socket.on("custom-group-volume-added", (customGroupVolume: Client.CustomGroupVolume) => {
                console.log("custom-group-volume-added");
                console.log(customGroupVolume);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomGroupVolumes(prevState => [...prevState, customGroupVolume]);
            });
            socket.on("custom-group-volume-changed", (customGroupVolume: Client.CustomGroupVolume) => {
                console.log("custom-group-volume-changed");
                console.log(customGroupVolume);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomGroupVolumes(prevState => prevState.map(s => s._id === customGroupVolume._id ? {...s, ...customGroupVolume} : s));
            });
            socket.on("custom-group-volume-removed", (id: CustomGroupVolumeId) => {
                console.log("custom-group-volume-removed");
                console.log(id);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomGroupVolumes(prevState => prevState.filter(customGroupVolume => customGroupVolume._id !== id));
            });
            socket.on("custom-stage-member-volume-added", (customStageMemberVolume: Client.CustomStageMemberVolume) => {
                console.log("custom-stage-member-volume-added");
                console.log(customStageMemberVolume);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomStageMemberVolumes(prevState => [...prevState, customStageMemberVolume]);
            });
            socket.on("custom-stage-member-volume-changed", (customStageMemberVolume: Client.CustomStageMemberVolume) => {
                console.log("custom-stage-member-volume-changed");
                console.log(customStageMemberVolume);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomStageMemberVolumes(prevState => prevState.map(s => s._id === customStageMemberVolume._id ? {...s, ...customStageMemberVolume} : s));
            });
            socket.on("custom-stage-member-volume-removed", (id: CustomStageMemberVolumeId) => {
                console.log("custom-stage-member-volume-removed");
                console.log(id);
                // We don't need to filter by stage, since volumes are send for active stages only
                setCustomStageMemberVolumes(prevState => prevState.filter(customStageMemberVolume => customStageMemberVolume._id !== id));
            });
            socket.on("producer-added", (producer: Producer) => {
                console.log("producer-added-added");
                console.log(producer);
                // We don't need to filter by stage, since volumes are send for active stages only
                setProducerPrototypes(prevState => [...prevState, producer])
            });
            socket.on("producer-changed", (producer: Producer) => {
                console.log("producer-added-added");
                console.log(producer);
                // We don't need to filter by stage, since volumes are send for active stages only
                setProducerPrototypes(prevState => prevState.map(p => p._id === producer._id ? {...p, ...producer} : p));
            });
            socket.on("producer-removed", (producerId: string) => {
                console.log("producer-removed");
                console.log(producerId);
                // We don't need to filter by stage, since volumes are send for active stages only
                setProducerPrototypes(prevState => prevState.filter(producer => producer._id !== producerId));
            });
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