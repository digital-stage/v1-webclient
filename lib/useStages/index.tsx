import React, {useCallback, useEffect, useState} from "react";
import Client from "../useSocket/model.client";
import {GroupId, StageId, StageMemberId} from "../useSocket/model.common";
import {useDevices} from "../useDevices";
import {ClientStageEvents, ServerStageEvents} from "../useSocket/events";

export interface StagesProps {
    stages: Client.Stage[];

    createStage(name: string, password: string | null, width?: number, length?: number, height?: number, reflection?: number, absorption?: number);

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
    const {socket} = useDevices();

    const [stagePrototypes, setStagePrototypes] = useState<Client.StagePrototype[]>([]);
    const [groupPrototypes, setGroupPrototypes] = useState<Client.GroupPrototype[]>([]);
    const [groupMemberPrototypes, setGroupMemberPrototypes] = useState<Client.GroupMemberPrototype[]>([]);

    const [stages, setStages] = useState<Client.Stage[]>([]);

    useEffect(() => {
        const stages: Client.Stage[] = stagePrototypes.map(stagePrototype => {
            return {
                ...stagePrototype,
                groups: groupPrototypes.filter(groupPrototype => groupPrototype.stageId === stagePrototype._id)
                    .map(groupPrototype => ({
                        ...groupPrototype,
                        members: groupMemberPrototypes.filter(groupMemberPrototype => groupMemberPrototype.groupId === groupPrototype._id)
                            .map(groupMemberPrototype => ({
                                ...groupMemberPrototype,
                                // Use empty producers for non-active stages
                                videoProducers: [],
                                audioProducers: [],
                                ovProducers: []
                            }))
                    }))
            }
        })
        setStages(stages);
    }, [stagePrototypes, groupPrototypes, groupMemberPrototypes]);

    useEffect(() => {
        if (socket) {
            console.log("useStages: socket changed");
            console.log("Register stage changes");
            socket.on(ServerStageEvents.STAGE_ADDED, (stage: Client.StagePrototype) => {
                console.log("stage-added");
                console.log(stage);
                setStagePrototypes(prevState => [...prevState, stage]);
            });
            socket.on(ServerStageEvents.STAGE_CHANGED, (payload: { id: StageId, stage: Client.StagePrototype }) => {
                console.log("stage-changed");
                console.log(payload);
                setStagePrototypes(prevState => prevState.map(s => {
                    if (s._id === payload.id) {
                        console.log("Found stage");
                        return {...s, ...payload.stage};
                    }
                    return s;
                }))
            });
            socket.on(ServerStageEvents.STAGE_REMOVED, (stageId: string) => {
                console.log("stage-removed");
                console.log(stageId);
                setStagePrototypes(prevState => prevState.filter(stage => stage._id !== stageId));
            });
            socket.on(ServerStageEvents.GROUP_ADDED, (group: Client.GroupPrototype) => {
                console.log("group-added");
                console.log(group);
                setGroupPrototypes(prevState => [...prevState, group])
            });
            socket.on(ServerStageEvents.GROUP_CHANGED, (payload: { id: GroupId, group: Client.StageMemberPrototype }) => {
                console.log("group-changed");
                console.log(payload);
                setGroupPrototypes(prevState => prevState.map(s => s._id === payload.id ? {...s, ...payload.group} : s));
            });
            socket.on(ServerStageEvents.GROUP_REMOVED, (groupId: string) => {
                console.log("group-removed");
                console.log(groupId);
                setGroupPrototypes(prevState => prevState.filter(group => group._id !== groupId));
            });
            socket.on(ServerStageEvents.GROUP_MEMBER_ADDED, (stageMember: Client.GroupMemberPrototype) => {
                console.log("stage-member-added");
                console.log(stageMember);
                setGroupMemberPrototypes(prevState => [...prevState, stageMember])
            });
            socket.on(ServerStageEvents.GROUP_MEMBER_CHANGED, (payload: { id: StageMemberId, stageMember: Client.GroupMemberPrototype }) => {
                console.log("stage-member-changed");
                console.log(payload);
                setGroupMemberPrototypes(prevState => prevState.map(s => s._id === payload.id ? {...s, ...payload.stageMember} : s));
            });
            socket.on(ServerStageEvents.GROUP_MEMBER_REMOVED, (stageMemberId: string) => {
                console.log("stage-member-removed");
                console.log(stageMemberId);
                setGroupMemberPrototypes(prevState => prevState.filter(stageMember => stageMember._id !== stageMemberId));
            });
            socket.on("disconnect", () => {
                setStages([]);
                setStagePrototypes([]);
                setGroupPrototypes([]);
                setGroupMemberPrototypes([]);
            });
            isSocketInitialized = true;
        }
    }, [socket]);


    const createStage = useCallback((name: string, password: string, width?: number, length?: number, height?: number, reflection?: number, absorption?: number) => {
        if (socket) {
            socket.emit(ClientStageEvents.ADD_STAGE, {
                name: name,
                password: password,
                width: width || 25,
                length: length || 13,
                height: height || 7.5,
                reflection: reflection || 0.7,
                absorption: absorption || 0.6,
            });
        }
    }, [socket]);

    const updateStage = useCallback((id: StageId, stage: Partial<Client.StagePrototype>) => {
        if (socket) {
            socket.emit(ClientStageEvents.CHANGE_STAGE, {
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
            socket.emit(ClientStageEvents.JOIN_STAGE, payload);
        }
    }, [socket]);

    const leaveStage = useCallback(() => {
        if (socket) {
            socket.emit(ClientStageEvents.LEAVE_STAGE);
        }
    }, [socket]);

    const removeStage = useCallback((id: StageId) => {
        if (socket) {
            socket.emit(ClientStageEvents.REMOVE_STAGE, id);
        }
    }, [socket]);

    const createGroup = useCallback((stageId: StageId, name: string) => {
        if (socket) {
            socket.emit(ClientStageEvents.ADD_GROUP, {
                stageId: stageId,
                name: name
            });
        }
    }, [socket]);

    const updateGroup = useCallback((id: GroupId, group: Partial<Client.GroupPrototype>) => {
        if (socket) {
            socket.emit(ClientStageEvents.CHANGE_GROUP, {
                id: id,
                group: group
            });
        }
    }, [socket]);

    const removeGroup = useCallback((id: GroupId) => {
        if (socket) {
            socket.emit(ClientStageEvents.REMOVE_GROUP, id);
        }
    }, [socket]);

    const updateStageMember = useCallback((id: StageMemberId, stageMember: Partial<Client.StageMemberPrototype>) => {
        if (socket) {
            socket.emit(ClientStageEvents.CHANGE_GROUP_MEMBER, {
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