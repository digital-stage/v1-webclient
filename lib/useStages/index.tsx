import {useSocket} from "../useSocket";
import React, {useCallback, useEffect, useState} from "react";
import Client from "../useSocket/model.client";
import {GroupId, StageId, StageMemberId} from "../useSocket/model.common";

export interface StagesProps {
    stages: Client.Stage[];

    createStage(name: string, password: string | null);

    updateStage(id: StageId, stage: Partial<Client.StagePrototype>);

    joinStage(stageId: StageId, groupId: GroupId, password: string | null);

    leaveStage();

    removeStage(id: StageId);

    createGroup(stageId: StageId, name: string);

    updateGroup(id: GroupId, group: Partial<Client.GroupPrototype>);

    setGroupVolume(id: GroupId, volume: number);

    removeGroup(id: GroupId);

    updateStageMember(id: StageMemberId, stageMember: Partial<Client.StageMemberPrototype>);

    setStageMemberVolume(id: StageMemberId, volume: number);
}

const StagesContext = React.createContext<StagesProps>(undefined);

export const useStages = (): StagesProps => React.useContext<StagesProps>(StagesContext);

let isSocketInitialized = false;
export const StagesContextProvider = (props: {
    children: React.ReactNode
}) => {
    const socket = useSocket();

    const [stagePrototypes, setStagePrototypes] = useState<Client.StagePrototype[]>([]);
    const [groupPrototypes, setGroupPrototypes] = useState<Client.GroupPrototype[]>([]);
    const [stageMemberPrototypes, setStageMemberPrototypes] = useState<Client.StageMemberPrototype[]>([]);

    const [stages, setStages] = useState<Client.Stage[]>([]);

    useEffect(() => {
        const stages: Client.Stage[] = stagePrototypes.map(stagePrototype => {
            return {
                ...stagePrototype,
                groups: groupPrototypes.filter(groupPrototype => groupPrototype.stageId === stagePrototype._id)
                    .map(groupPrototype => ({
                        ...groupPrototype,
                        members: stageMemberPrototypes.filter(stageMemberPrototype => stageMemberPrototype.groupId === groupPrototype._id)
                            .map(stageMemberPrototype => ({
                                ...stageMemberPrototype,
                                // Use empty producers for non-active stages
                                videoProducers: [],
                                audioProducers: [],
                                ovProducers: []
                            }))
                    }))
            }
        })
        setStages(stages);
    }, [stagePrototypes, groupPrototypes, stageMemberPrototypes]);

    useEffect(() => {
        if (socket) {
            console.log("useStages: socket changed");
            console.log("Register stage changes");
            socket.on("stage-added", (stage: Client.StagePrototype) => {
                console.log("stage-added");
                console.log(stage);
                setStagePrototypes(prevState => [...prevState, stage]);
            });
            socket.on("stage-changed", (stage: Client.StagePrototype) => {
                console.log("stage-changed");
                console.log(stage);
                setStagePrototypes(prevState => prevState.map(s => s._id === stage._id ? {...s, ...stage} : s));
            });
            socket.on("stage-removed", (stageId: string) => {
                console.log("stage-removed");
                console.log(stageId);
                setStagePrototypes(prevState => prevState.filter(stage => stage._id !== stageId));
            });
            socket.on("group-added", (group: Client.GroupPrototype) => {
                console.log("group-added");
                console.log(group);
                setGroupPrototypes(prevState => [...prevState, group])
            });
            socket.on("group-changed", (group: Client.StageMemberPrototype) => {
                console.log("group-changed");
                console.log(group);
                setGroupPrototypes(prevState => prevState.map(s => s._id === group._id ? {...s, ...group} : s));
            });
            socket.on("group-removed", (groupId: string) => {
                console.log("group-removed");
                console.log(groupId);
                setGroupPrototypes(prevState => prevState.filter(group => group._id !== groupId));
            });
            socket.on("stage-member-added", (stageMember: Client.StageMemberPrototype) => {
                console.log("stage-member-added");
                console.log(stageMember);
                setStageMemberPrototypes(prevState => [...prevState, stageMember])
            });
            socket.on("stage-member-changed", (stageMember: Client.StageMemberPrototype) => {
                console.log("stage-member-changed");
                console.log(stageMember);
                setStageMemberPrototypes(prevState => prevState.map(s => s._id === stageMember._id ? {...s, ...stageMember} : s));
            });
            socket.on("stage-member-removed", (stageMemberId: string) => {
                console.log("stage-member-removed");
                console.log(stageMemberId);
                setStageMemberPrototypes(prevState => prevState.filter(stageMember => stageMember._id !== stageMemberId));
            });
            isSocketInitialized = true;
        }
    }, [socket]);


    const createStage = useCallback((name: string, password: string) => {
        if (socket) {
            socket.emit("add-stage", {
                name: name,
                password: password
            });
        }
    }, [socket]);

    const updateStage = useCallback((id: StageId, stage: Partial<Client.StagePrototype>) => {
        if (socket) {
            socket.emit("update-stage", {
                id: id,
                stage: stage
            });
        }
    }, [socket]);

    const joinStage = useCallback((stageId: StageId, groupId: GroupId, password: string) => {
        if (socket) {
            const payload = {
                stageId: stageId,
                groupId: groupId,
                password: password || undefined
            }
            console.log(payload);
            socket.emit("join-stage", payload);
        }
    }, [socket]);

    const leaveStage = useCallback(() => {
        if (socket) {
            socket.emit("leave-stage");
        }
    }, [socket]);

    const removeStage = useCallback((id: StageId) => {
        if (socket) {
            socket.emit("remove-stage", id);
        }
    }, [socket]);

    const createGroup = useCallback((stageId: StageId, name: string) => {
        if (socket) {
            socket.emit("add-group", {
                stageId: stageId,
                name: name
            });
        }
    }, [socket]);

    const updateGroup = useCallback((id: GroupId, group: Partial<Client.GroupPrototype>) => {
        if (socket) {
            socket.emit("update-stage", {
                id: id,
                stage: group
            });
        }
    }, [socket]);

    const removeGroup = useCallback((id: GroupId) => {
        if (socket) {
            socket.emit("remove-group", id);
        }
    }, [socket]);

    const updateStageMember = useCallback((id: StageMemberId, stageMember: Partial<Client.StageMemberPrototype>) => {
        if (socket) {
            socket.emit("update-stage-member", {
                id: id,
                stageMember: stageMember
            });
        }
    }, [socket]);

    const setGroupVolume = useCallback((id: GroupId, volume: number) => updateGroup(id, {
        volume: volume
    }), [updateGroup]);


    const setStageMemberVolume = useCallback((id: StageMemberId, volume: number) => updateStageMember(id, {
        volume: volume
    }), [updateStageMember]);


    return (
        <StagesContext.Provider value={{
            stages,
            createStage,
            joinStage,
            leaveStage,
            updateStage,
            removeStage,
            createGroup,
            updateGroup,
            removeGroup,
            updateStageMember,
            setGroupVolume,
            setStageMemberVolume
        }}>
            {props.children}
        </StagesContext.Provider>
    );
}