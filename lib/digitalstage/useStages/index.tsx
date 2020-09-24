import React, {useCallback, useEffect, useState} from "react";
import Server from "../common/model.server";
import {
    CustomGroupVolumeId,
    CustomStageMemberVolumeId,
    GroupId,
    Producer,
    StageId,
    StageMemberId
} from "../common/model.common";
import {useDevices} from "../useDevices";
import {ClientStageEvents, ServerStageEvents} from "../common/events";
import useMediasoup from "../useMediasoup";
import {useRequest} from "../../useRequest";
import Client from "../common/model.client";

export interface StagesProps {
    stages: Client.Stage[];

    stage: Client.Stage;

    stageId?: { stageId: StageId, groupId: GroupId };

    createStage(name: string, password: string | null, width?: number, length?: number, height?: number, reflection?: number, absorption?: number);

    updateStage(id: StageId, stage: Partial<Server.Stage>);

    joinStage(stageId: StageId, groupId: GroupId, password: string | null): Promise<void>;

    leaveStage();

    leaveStageForGood(id: StageId);

    removeStage(id: StageId);

    createGroup(stageId: StageId, name: string);

    updateGroup(id: GroupId, group: Partial<Server.Group>);

    setGroupVolume(id: GroupId, volume: number);

    removeGroup(id: GroupId);

    updateStageMember(id: StageMemberId, stageMember: Partial<Server.StageMember>);

    setStageMemberVolume(id: StageMemberId, volume: number);

    setCustomGroupVolume(groupId: GroupId, volume: number);

    setCustomGroupMemberVolume(id: StageMemberId, volume: number);
}

const StagesContext = React.createContext<StagesProps>(undefined);

export const useStages = (): StagesProps => React.useContext<StagesProps>(StagesContext);

export const StagesContextConsumer = StagesContext.Consumer;

export const StagesContextProvider = (props: {
    children: React.ReactNode
}) => {
    const {socket, user} = useDevices();
    const [stageId, setStageId] = useState<{ stageId: StageId, groupId: GroupId }>();
    const {setRequest} = useRequest();

    // Prototypes
    const [stagePrototypes, setStagePrototypes] = useState<Server.Stage[]>([]);
    const [groupPrototypes, setGroupPrototypes] = useState<Server.Group[]>([]);
    const [stageMemberPrototypes, setStageMemberPrototypes] = useState<Server.StageMember[]>([]);
    const [customGroupVolumes, setCustomGroupVolumes] = useState<Server.CustomGroupVolume[]>([]);
    const [customStageMemberVolumes, setCustomStageMemberVolumes] = useState<Server.CustomStageMemberVolume[]>([]);
    const {audioConsumers, videoConsumers, ovConsumers} = useMediasoup();

    // Resolved Objects
    const [stage, setStage] = useState<Client.Stage>();
    const [stages, setStages] = useState<Client.Stage[]>([]);

    // Resolve stage objects
    useEffect(() => {
        const stages: Client.Stage[] = stagePrototypes.map(stagePrototype => {
            const stage: Client.Stage = {
                ...stagePrototype,
                isAdmin: user && stagePrototype.admins.indexOf(user._id) !== -1,
                groups: groupPrototypes.filter(groupPrototype => groupPrototype.stageId === stagePrototype._id).map(groupPrototype => {
                    const customVolume = customGroupVolumes.find(customGroupVolume => customGroupVolume.groupId === groupPrototype._id);
                    const group: Client.Group = {
                        ...groupPrototype,
                        customVolume: customVolume ? customVolume.volume : undefined,
                        members: stageMemberPrototypes.filter(groupMemberPrototype => groupMemberPrototype.groupId === groupPrototype._id).map(groupMemberPrototype => {
                            const customVolume = customStageMemberVolumes.find(customStageMemberVolume => customStageMemberVolume.stageMemberId === groupMemberPrototype._id);
                            const member: Client.GroupMember = {
                                ...groupMemberPrototype,
                                customVolume: customVolume ? customVolume.volume : undefined,
                                audioProducers: audioConsumers.filter(producer => producer.userId === groupMemberPrototype.userId),
                                videoProducers: videoConsumers.filter(producer => producer.userId === groupMemberPrototype.userId),
                                ovProducers: ovConsumers.filter(producer => producer.userId === groupMemberPrototype.userId)
                            }
                            return member;
                        })
                    }
                    return group;
                })
            };
            return stage;
        })
        setStages(stages);
    }, [user, stagePrototypes, groupPrototypes, stageMemberPrototypes, customGroupVolumes, customStageMemberVolumes, ovConsumers, audioConsumers, videoConsumers]);

    // Assign active stage
    useEffect(() => {
        if (stageId) {
            setStage(stages.find(stage => stage._id === stageId.stageId));
        } else {
            setStage(undefined);
        }
    }, [stageId, stages]);

    const registerDeviceEvents = (socket) => {
        socket.on(ServerStageEvents.STAGE_ADDED, (stage: Server.Stage) => {
            setStagePrototypes(prevState => [...prevState, stage]);
        });
        socket.on(ServerStageEvents.STAGE_CHANGED, (payload: { id: StageId, stage: Server.Stage }) => {
            setStagePrototypes(prevState => prevState.map(s => {
                if (s._id === payload.id) {
                    return {...s, ...payload.stage};
                }
                return s;
            }))
        });
        socket.on(ServerStageEvents.STAGE_REMOVED, (stageId: string) => {
            setStagePrototypes(prevState => prevState.filter(stage => stage._id !== stageId));
        });
        socket.on(ServerStageEvents.GROUP_ADDED, (group: Server.Group) => {
            setGroupPrototypes(prevState => [...prevState, group])
        });
        socket.on(ServerStageEvents.GROUP_CHANGED, (payload: { id: GroupId, group: Server.Group }) => {
            setGroupPrototypes(prevState => prevState.map(s => s._id === payload.id ? {...s, ...payload.group} : s));
        });
        socket.on(ServerStageEvents.GROUP_REMOVED, (groupId: string) => {
            setGroupPrototypes(prevState => prevState.filter(group => group._id !== groupId));
        });
        socket.on(ServerStageEvents.GROUP_MEMBER_ADDED, (stageMember: Server.StageMember) => {
            console.log(ServerStageEvents.GROUP_MEMBER_ADDED);
            setStageMemberPrototypes(prevState => [...prevState, stageMember])
        });
        socket.on(ServerStageEvents.GROUP_MEMBER_CHANGED, (payload: Partial<Server.StageMember>) => {
            console.log(ServerStageEvents.GROUP_MEMBER_CHANGED);
            setStageMemberPrototypes(prevState => prevState.map(s => s._id === payload._id ? {...s, ...payload} : s));
        });
        socket.on(ServerStageEvents.GROUP_MEMBER_REMOVED, (stageMemberId: string) => {
            console.log(ServerStageEvents.GROUP_MEMBER_REMOVED);
            setStageMemberPrototypes(prevState => prevState.filter(stageMember => stageMember._id !== stageMemberId));
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_ADDED, (customGroupVolume: Server.CustomGroupVolume) => {
            console.log("custom-group-volume-added");
            console.log(customGroupVolume);
            // We don't need to filter by stage, since volumes are send for active stages only
            setCustomGroupVolumes(prevState => [...prevState, customGroupVolume]);
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_VOLUME_CHANGED, (customGroupVolume: Server.CustomGroupVolume) => {
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
        socket.on(ServerStageEvents.CUSTOM_GROUP_MEMBER_VOLUME_ADDED, (customStageMemberVolume: Server.CustomStageMemberVolume) => {
            console.log("custom-stage-member-volume-added");
            console.log(customStageMemberVolume);
            // We don't need to filter by stage, since volumes are send for active stages only
            setCustomStageMemberVolumes(prevState => [...prevState, customStageMemberVolume]);
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_MEMBER_CHANGED, (customStageMemberVolume: Server.CustomStageMemberVolume) => {
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
        socket.on(ServerStageEvents.STAGE_JOINED, (payload: {
            stageId: StageId,
            groupId: GroupId,
            stage?: Server.Stage;
            groups?: Server.Group[];
            stageMembers: Server.StageMember[];
            customGroupVolumes: Server.CustomGroupVolume[];
            customStageMemberVolumes: Server.CustomStageMemberVolume[];
            producers: Producer[];
        }) => {
            setStageId({
                stageId: payload.stageId,
                groupId: payload.groupId
            });
            if (payload.stage) {
                setStagePrototypes(prevState => [...prevState, payload.stage]);
            }
            if (payload.groups) {
                setGroupPrototypes(prevState => [...prevState, ...payload.groups]);
            }
            setStageMemberPrototypes(payload.stageMembers);
            setCustomGroupVolumes(payload.customGroupVolumes);
            setCustomStageMemberVolumes(payload.customStageMemberVolumes);
        });
        socket.on(ServerStageEvents.STAGE_LEFT, () => {
            setStageId(undefined);
            setStageMemberPrototypes([]);
            setCustomStageMemberVolumes([]);
            setCustomGroupVolumes([]);
        });
        socket.on("disconnect", () => {
            setStages([]);
            setStagePrototypes([]);
            setGroupPrototypes([]);
            setStageMemberPrototypes([]);
            setCustomGroupVolumes([]);
            setCustomStageMemberVolumes([]);
        });
    };
    useEffect(() => {
        if (socket) {
            registerDeviceEvents(socket);
        } else {
            console.log("RESET ALL");
            setStageId(undefined);
            setStages([]);
            setStagePrototypes([]);
            setGroupPrototypes([]);
            setStageMemberPrototypes([]);
            setCustomGroupVolumes([]);
            setCustomStageMemberVolumes([]);
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

    const updateStage = useCallback((id: StageId, stage: Partial<Server.Stage>) => {
        if (socket) {
            socket.emit(ClientStageEvents.CHANGE_STAGE, {
                id: id,
                stage: stage
            });
        }
    }, [socket]);

    const joinStage = useCallback((stageId: StageId, groupId: GroupId, password: string): Promise<void> => {
        if (socket) {
            const payload = {
                stageId: stageId,
                groupId: groupId,
                password: password || undefined
            }
            return new Promise<void>((resolve, reject) => {
                socket.emit(ClientStageEvents.JOIN_STAGE, payload, (error) => {
                    if (!error)
                        resolve();
                    else
                        reject(error);
                });
            })
        }
    }, [socket]);

    const leaveStage = useCallback(() => {
        if (socket) {
            socket.emit(ClientStageEvents.LEAVE_STAGE);
        }
        setRequest(undefined, undefined, null);
    }, [socket]);

    const leaveStageForGood = useCallback((id: StageId) => {
        if (socket) {
            socket.emit(ClientStageEvents.LEAVE_STAGE_FOR_GOOD, id);
        }
        if (stageId && stageId.stageId === id) {
            setRequest(undefined, undefined, null);
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

    const updateGroup = useCallback((id: GroupId, group: Partial<Server.Group>) => {
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

    const updateStageMember = useCallback((id: StageMemberId, stageMember: Partial<Server.StageMember>) => {
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

    // DEBUG
    useEffect(() => {
        console.log("stageId changed:");
        console.log(stageId);
    }, [stageId])

    useEffect(() => {
        console.log("stage changed");
    }, [stage])

    return (
        <StagesContext.Provider value={{
            stage,
            stageId,
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
            setStageMemberVolume,
            setCustomGroupVolume: setCustomGroupVolume,
            setCustomGroupMemberVolume: setCustomGroupMemberVolume,
            leaveStageForGood: leaveStageForGood
        }}>
            {props.children}
        </StagesContext.Provider>
    );
}