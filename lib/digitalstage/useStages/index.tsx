import React, {useCallback, useEffect, useRef, useState} from "react";
import * as Server from "./../common/model.server";
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
import debounce from "lodash.debounce";

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
    const [customGroups, setCustomGroups] = useState<Server.CustomGroup[]>([]);
    const [customStageMembers, setCustomStageMembers] = useState<Server.CustomStageMember[]>([]);
    const {localAudioConsumers, localVideoConsumers, remoteOvTracks} = useMediasoup();

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
                    const customVolume = customGroups.find(customGroupVolume => customGroupVolume.groupId === groupPrototype._id);
                    const group: Client.Group = {
                        ...groupPrototype,
                        customVolume: customVolume ? customVolume.volume : undefined,
                        members: stageMemberPrototypes.filter(groupMemberPrototype => groupMemberPrototype.groupId === groupPrototype._id).map(groupMemberPrototype => {
                            const customVolume = customStageMembers.find(customStageMemberVolume => customStageMemberVolume.stageMemberId === groupMemberPrototype._id);
                            const member: Client.GroupMember = {
                                ...groupMemberPrototype,
                                customVolume: customVolume ? customVolume.volume : undefined,
                                audioConsumers: localAudioConsumers.filter(consumer => consumer.remoteProducer.userId === groupMemberPrototype.userId),
                                videoConsumers: localVideoConsumers.filter(consumer => consumer.remoteProducer.userId === groupMemberPrototype.userId),
                                ovTracks: remoteOvTracks.filter(track => track.userId === groupMemberPrototype.userId)
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
    }, [user, stagePrototypes, groupPrototypes, stageMemberPrototypes, customGroups, customStageMembers, localAudioConsumers, localVideoConsumers, remoteOvTracks]);

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
        socket.on(ServerStageEvents.STAGE_MEMBER_ADDED, (stageMember: Server.StageMember) => {
            console.log(ServerStageEvents.STAGE_MEMBER_ADDED);
            setStageMemberPrototypes(prevState => [...prevState, stageMember])
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_CHANGED, (payload: Partial<Server.StageMember>) => {
            console.log(ServerStageEvents.STAGE_MEMBER_CHANGED);
            console.log("HEY");
            setStageMemberPrototypes(prevState => prevState.map(s => s._id === payload._id ? {...s, ...payload} : s));
        });
        socket.on(ServerStageEvents.STAGE_MEMBER_REMOVED, (stageMemberId: string) => {
            console.log(ServerStageEvents.STAGE_MEMBER_REMOVED);
            setStageMemberPrototypes(prevState => prevState.filter(stageMember => stageMember._id !== stageMemberId));
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_ADDED, (customGroupVolume: Server.CustomGroup) => {
            console.log("custom-group-volume-added");
            console.log(customGroupVolume);
            // We don't need to filter by stage, since volumes are send for active stages only
            setCustomGroups(prevState => [...prevState, customGroupVolume]);
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_CHANGED, (customGroupVolume: Server.CustomGroup) => {
            console.log("custom-group-volume-changed");
            console.log(customGroupVolume);
            // We don't need to filter by stage, since volumes are send for active stages only
            setCustomGroups(prevState => prevState.map(s => s._id === customGroupVolume._id ? {...s, ...customGroupVolume} : s));
        });
        socket.on(ServerStageEvents.CUSTOM_GROUP_REMOVED, (id: CustomGroupVolumeId) => {
            console.log("custom-group-volume-removed");
            console.log(id);
            // We don't need to filter by stage, since volumes are send for active stages only
            setCustomGroups(prevState => prevState.filter(customGroupVolume => customGroupVolume._id !== id));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED, (customStageMemberVolume: Server.CustomStageMember) => {
            console.log("custom-stage-member-volume-added");
            console.log(customStageMemberVolume);
            // We don't need to filter by stage, since volumes are send for active stages only
            setCustomStageMembers(prevState => [...prevState, customStageMemberVolume]);
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED, (customStageMemberVolume: Server.CustomStageMember) => {
            console.log("custom-stage-member-volume-changed");
            console.log(customStageMemberVolume);
            // We don't need to filter by stage, since volumes are send for active stages only
            setCustomStageMembers(prevState => prevState.map(s => s._id === customStageMemberVolume._id ? {...s, ...customStageMemberVolume} : s));
        });
        socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED, (id: CustomStageMemberVolumeId) => {
            console.log("custom-stage-member-volume-removed");
            console.log(id);
            // We don't need to filter by stage, since volumes are send for active stages only
            setCustomStageMembers(prevState => prevState.filter(customStageMemberVolume => customStageMemberVolume._id !== id));
        });
        socket.on(ServerStageEvents.STAGE_JOINED, (payload: {
            stageId: StageId,
            groupId: GroupId,
            stage?: Server.Stage;
            groups?: Server.Group[];
            stageMembers: Server.StageMember[];
            customGroups: Server.CustomGroup[];
            customStageMembers: Server.CustomStageMember[];
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
            setCustomGroups(payload.customGroups);
            setCustomStageMembers(payload.customStageMembers);
        });
        socket.on(ServerStageEvents.STAGE_LEFT, () => {
            setStageId(undefined);
            setStageMemberPrototypes([]);
            setCustomStageMembers([]);
            setCustomGroups([]);
        });
        socket.on("disconnect", () => {
            setStages([]);
            setStagePrototypes([]);
            setGroupPrototypes([]);
            setStageMemberPrototypes([]);
            setCustomGroups([]);
            setCustomStageMembers([]);
        });
    };
    useEffect(() => {
        if (socket) {
            registerDeviceEvents(socket);
            return () => {
                console.log("[useStages] Cleaning up");
                setStageId(undefined);
                setStages([]);
                setStagePrototypes([]);
                setGroupPrototypes([]);
                setStageMemberPrototypes([]);
                setCustomGroups([]);
                setCustomStageMembers([]);
            }
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


    const updateGroupInternal = useCallback((id: GroupId, update: Partial<Server.Group>) => {
        if (socket) {
            socket.emit(ClientStageEvents.CHANGE_GROUP, {
                id: id,
                group: update
            });
        }
    }, [socket]);
    const updateGroupDebounced = useCallback(debounce((id: GroupId, update: Partial<Server.Group>) => updateGroupInternal(id, update), 500), [updateGroupInternal]);
    const updateGroup = useCallback((id: GroupId, update: Partial<Server.Group>) => {
        setGroupPrototypes(prevState => prevState.map(group => group._id === id ? {
            ...group,
            ...update
        } : group));
        updateGroupDebounced(id, update);
    }, [updateGroupDebounced]);

    const removeGroup = useCallback((id: GroupId) => {
        if (socket) {
            socket.emit(ClientStageEvents.REMOVE_GROUP, id);
        }
    }, [socket]);


    const updateStageMemberInternal = useCallback((id: StageMemberId, update: Partial<Server.StageMember>) => {
        if (socket) {
            socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER, {
                id: id,
                stageMember: update
            });
        }
    }, [socket]);


    const updateStageMemberDebounced = useCallback(debounce((id: StageMemberId, update: Partial<Server.StageMember>) => updateStageMemberInternal(id, update), 500), [updateStageMemberInternal]);
    const updateStageMember = useCallback((id: StageMemberId, update: Partial<Server.StageMember>) => {
        // Change localy
        setStageMemberPrototypes(prevState => prevState.map(stageMember => stageMember._id === id ? {
            ...stageMember,
            ...update
        } : stageMember))
        // And send change to server debounced
        updateStageMemberDebounced(id, update);
    }, [updateStageMemberDebounced]);

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