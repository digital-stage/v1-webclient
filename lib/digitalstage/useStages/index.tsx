import React, {useCallback, useEffect, useState} from "react";
import * as Server from "./../common/model.server";
import {useDevices} from "../useDevices";
import {ClientStageEvents, ServerStageEvents} from "../common/events";
import {useRequest} from "../../useRequest";
import {Client} from "../common/model.client";
import {GroupId, StageId, StageMemberId} from "../common/model.common";
import {
    AddGroupPayload,
    AddStagePayload,
    ChangeGroupPayload, ChangeStageMemberPayload,
    ChangeStagePayload,
    JoinStagePayload
} from "../common/payloads";
import omit from "lodash.omit";

export type Users = { [id: string]: Server.User };
export type Stages = { [id: string]: Client.Stage };
export type Groups = { [id: string]: Server.Group };
export type CustomGroups = { [id: string]: Server.CustomGroup };
export type StageMembers = { [id: string]: Server.StageMember };
export type CustomStageMembers = { [id: string]: Server.CustomStageMember };
export type StageMemberVideoProducers = { [id: string]: Server.StageMemberVideoProducer };
export type StageMemberAudioProducers = { [id: string]: Server.StageMemberAudioProducer };
export type CustomStageMemberAudioProducers = { [id: string]: Server.CustomStageMemberAudioProducer };
export type StageMemberOvTracks = { [id: string]: Server.StageMemberOvTrack };
export type CustomStageMemberOvTracks = { [id: string]: Server.CustomStageMemberOvTrack };

export interface StagesProps {
    // States
    stageId?: {
        stageId: Server.StageId;
        groupId: Server.GroupId;
    }
    stage?: Client.Stage;
    availableStages: Stages;
    groups: Groups;
    customGroups: CustomGroups;
    users: Users;
    stageMembers: StageMembers;
    customStageMembers: CustomStageMembers;
    videoProducers: StageMemberVideoProducers;
    audioProducers: StageMemberAudioProducers;
    customAudioProducers: CustomStageMemberAudioProducers;
    ovTracks: StageMemberOvTracks;
    customOvTracks: CustomStageMemberOvTracks;

    // WHAT SHALL WE USE?
    arrAvailableStages: Client.Stage[];
    arrGroups: Server.Group[];
    arrCustomGroups: Server.CustomGroup[];
    arrUsers: Server.User[];
    arrStageMembers: Server.StageMember[];
    arrCustomStageMembers: Server.CustomStageMember[];
    arrVideoProducers: Server.StageMemberVideoProducer[];
    arrAudioProducers: Server.StageMemberAudioProducer[];
    arrCustomAudioProducers: Server.CustomStageMemberAudioProducer[];
    arrOvTracks: Server.StageMemberOvTrack[];
    arrCustomOvTracks: Server.CustomStageMemberOvTrack[];

    // Methods
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
    const {setRequest} = useRequest();

    // Data
    const [users, setUsers] = useState<Users>({});
    const [stages, setStages] = useState<Stages>({});
    const [groups, setGroups] = useState<Groups>({});

    // Single stage data
    const [stage, setStage] = useState<Client.Stage>();
    const [stageId, setStageId] = useState<{ stageId: Server.StageId, groupId: Server.GroupId }>();
    const [customGroups, setCustomGroups] = useState<CustomGroups>({});
    const [stageMembers, setStageMembers] = useState<StageMembers>({});
    const [customStageMembers, setCustomStageMembers] = useState<CustomStageMembers>({});
    const [audioProducers, setAudioProducers] = useState<StageMemberAudioProducers>({});
    const [customAudioProducers, setCustomAudioProducers] = useState<CustomStageMemberAudioProducers>({});
    const [videoProducers, setVideoProducers] = useState<StageMemberVideoProducers>({});
    const [ovTracks, setOvTracks] = useState<StageMemberOvTracks>({});
    const [customOvTracks, setCustomOvTracks] = useState<CustomStageMemberOvTracks>({});

    const [arrUsers, setArrUsers] = useState<Server.User[]>([]);
    const [arrAvailableStages, setArrAvailableStages] = useState<Client.Stage[]>([]);
    const [arrGroups, setArrGroups] = useState<Server.Group[]>([]);
    const [arrCustomGroups, setArrCustomGroups] = useState<Server.CustomGroup[]>([]);
    const [arrStageMembers, setArrStageMembers] = useState<Server.StageMember[]>([]);
    const [arrCustomStageMembers, setArrCustomStageMembers] = useState<Server.CustomStageMember[]>([]);
    const [arrAudioProducers, setArrAudioProducers] = useState<Server.StageMemberAudioProducer[]>([]);
    const [arrCustomAudioProducers, setArrCustomAudioProducers] = useState<Server.CustomStageMemberAudioProducer[]>([]);
    const [arrVideoProducers, setArrVideoProducers] = useState<Server.StageMemberVideoProducer[]>([]);
    const [arrOvTracks, setArrOvTracks] = useState<Server.StageMemberOvTrack[]>([]);
    const [arrCustomOvTracks, setArrCustomOvTracks] = useState<Server.CustomStageMemberOvTrack[]>([]);


    const handleStageJoined = useCallback((payload: Server.InitialStagePackage) => {
        setUsers(payload.users.reduce<Users>((prev, cur) => {
            prev[cur._id] = cur;
            return prev
        }, {}));
        if (payload.stage) {
            setStages(prevState => ({
                ...prevState, [payload.stage._id]: {
                    ...payload.stage,
                    isAdmin: payload.stage.admins.find(admin => user._id === admin) !== undefined
                }
            }));
            setStage({
                ...payload.stage,
                isAdmin: payload.stage.admins.find(admin => user._id === admin) !== undefined
            });
        } else {
            const stage: Server.Stage = stages[payload.stageId];
            if (stage) {
                setStage({
                    ...stage,
                    isAdmin: stage.admins.find(admin => user._id === admin) !== undefined
                });
            }
        }
        if (payload.groups) {
            setGroups(payload.groups.reduce<Groups>((prev, cur) => {
                prev[cur._id] = cur;
                return prev
            }, {}));
        }
        setCustomGroups(payload.customGroups.reduce<CustomGroups>((prev, cur) => {
            prev[cur._id] = cur;
            return prev
        }, {}));
        setStageMembers(payload.stageMembers.reduce<StageMembers>((prev, cur) => {
            prev[cur._id] = cur;
            return prev
        }, {}));
        setCustomStageMembers(payload.customStageMembers.reduce<CustomStageMembers>((prev, cur) => {
            prev[cur._id] = cur;
            return prev
        }, {}));
        setVideoProducers(payload.videoProducers.reduce<StageMemberVideoProducers>((prev, cur) => {
            prev[cur._id] = cur;
            return prev
        }, {}));
        setAudioProducers(payload.audioProducers.reduce<StageMemberAudioProducers>((prev, cur) => {
            prev[cur._id] = cur;
            return prev
        }, {}));
        setCustomAudioProducers(payload.customAudioProducers.reduce<CustomStageMemberAudioProducers>((prev, cur) => {
            prev[cur._id] = cur;
            return prev
        }, {}));
        setOvTracks(payload.ovTracks.reduce<StageMemberOvTracks>((prev, cur) => {
            prev[cur._id] = cur;
            return prev
        }, {}));
        setCustomOvTracks(payload.customOvTracks.reduce<CustomStageMemberOvTracks>((prev, cur) => {
            prev[cur._id] = cur;
            return prev
        }, {}));
        setStageId({
            stageId: payload.stageId,
            groupId: payload.groupId
        });
    }, [stages]);

    useEffect(() => {
        if (socket && user) {
            console.log("[useStages] Registering socket handlers");
            socket.on(ServerStageEvents.STAGE_JOINED, (payload: Server.InitialStagePackage) => handleStageJoined(payload));

            socket.on(ServerStageEvents.USER_ADDED, (payload: Server.User) => {
                setUsers(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.USER_CHANGED, (payload: Server.User) => {
                setUsers(prevState => ({...prevState, [payload._id]: payload}));
            });
            socket.on(ServerStageEvents.USER_REMOVED, (payload: Server.UserId) => {
                setUsers(prevState => omit(prevState, payload));
            });

            socket.on(ServerStageEvents.STAGE_ADDED, (payload: Server.Stage) => {
                setStages(prevState => ({
                    ...prevState, [payload._id]: {
                        ...payload,
                        isAdmin: payload.admins.find(admin => user._id === admin) !== undefined
                    }
                }));
            });
            socket.on(ServerStageEvents.STAGE_CHANGED, (payload: Server.Stage) => {
                setStages(prevState => ({
                    ...prevState, [payload._id]: {
                        ...prevState[payload._id],
                        ...payload,
                        isAdmin: payload.admins ? payload.admins.find(admin => user._id === admin) !== undefined : prevState[payload._id].isAdmin
                    }
                }));
            });
            socket.on(ServerStageEvents.STAGE_REMOVED, (payload: Server.UserId) => {
                setStages(prevState => omit(prevState, payload));
            });

            socket.on(ServerStageEvents.GROUP_ADDED, (payload: Server.Group) => {
                setGroups(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.GROUP_CHANGED, (payload: Server.Group) => {
                setGroups(prevState => ({...prevState, [payload._id]: {...prevState[payload._id], ...payload}}));
            });
            socket.on(ServerStageEvents.GROUP_REMOVED, (payload: Server.GroupId) => {
                setGroups(prevState => omit(prevState, payload));
            });

            socket.on(ServerStageEvents.CUSTOM_GROUP_ADDED, (payload: Server.CustomGroup) => {
                setCustomGroups(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_CHANGED, (payload: Server.CustomGroup) => {
                setCustomGroups(prevState => ({...prevState, [payload._id]: {...prevState[payload._id], ...payload}}));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_REMOVED, (payload: Server.CustomGroupId) => {
                setCustomGroups(prevState => omit(prevState, payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_ADDED, (payload: Server.StageMember) => {
                setStageMembers(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_CHANGED, (payload: Server.StageMember) => {
                setStageMembers(prevState => ({...prevState, [payload._id]: {...prevState[payload._id], ...payload}}));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_REMOVED, (payload: Server.StageMemberId) => {
                setStageMembers(prevState => omit(prevState, payload));
            });


            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED, (payload: Server.CustomStageMember) => {
                setCustomStageMembers(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED, (payload: Server.CustomStageMember) => {
                setCustomStageMembers(prevState => ({
                    ...prevState,
                    [payload._id]: {...prevState[payload._id], ...payload}
                }));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED, (payload: Server.CustomStageMemberId) => {
                setCustomStageMembers(prevState => omit(prevState, payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED, (payload: Server.StageMemberVideoProducer) => {
                setVideoProducers(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED, (payload: Server.StageMemberVideoProducer) => {
                setVideoProducers(prevState => ({
                    ...prevState,
                    [payload._id]: {...prevState[payload._id], ...payload}
                }));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED, (payload: Server.StageMemberVideoProducerId) => {
                setVideoProducers(prevState => omit(prevState, payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED, (payload: Server.StageMemberAudioProducer) => {
                setAudioProducers(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.StageMemberAudioProducer) => {
                setAudioProducers(prevState => ({
                    ...prevState,
                    [payload._id]: {...prevState[payload._id], ...payload}
                }));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.StageMemberAudioProducerId) => {
                setAudioProducers(prevState => omit(prevState, payload));
            });

            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED, (payload: Server.CustomStageMemberAudioProducer) => {
                setCustomAudioProducers(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.CustomStageMemberAudioProducer) => {
                setCustomAudioProducers(prevState => ({
                    ...prevState,
                    [payload._id]: {...prevState[payload._id], ...payload}
                }));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.CustomStageMemberAudioProducerId) => {
                setCustomAudioProducers(prevState => omit(prevState, payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_OV_ADDED, (payload: Server.StageMemberOvTrack) => {
                setOvTracks(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_OV_CHANGED, (payload: Server.StageMemberOvTrack) => {
                setOvTracks(prevState => ({...prevState, [payload._id]: {...prevState[payload._id], ...payload}}));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_OV_REMOVED, (payload: Server.StageMemberOvTrackId) => {
                setOvTracks(prevState => omit(prevState, payload));
            });

            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED, (payload: Server.CustomStageMemberOvTrack) => {
                setCustomOvTracks(prevState => ({...prevState, [payload._id]: payload}))
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED, (payload: Server.CustomStageMemberOvTrack) => {
                setCustomOvTracks(prevState => ({
                    ...prevState,
                    [payload._id]: {...prevState[payload._id], ...payload}
                }));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED, (payload: Server.CustomStageMemberOvTrackId) => {
                setCustomOvTracks(prevState => omit(prevState, payload));
            });

            return () => {
                setUsers({});
                setStages({});
                setGroups({});
                setCustomGroups({});
                setStageMembers({});
                setCustomStageMembers({});
                setAudioProducers({});
                setVideoProducers({});
                setOvTracks({});
                setOvTracks({});
            }
        }
    }, [socket, user]);

    const createStage = useCallback((name: string, password: string, width?: number, length?: number, height?: number, reflection?: number, absorption?: number) => {
        if (socket) {
            const payload: AddStagePayload = {
                name: name,
                password: password,
                width: width || 25,
                length: length || 13,
                height: height || 7.5,
                damping: reflection || 0.7,
                absorption: absorption || 0.6
            }
            socket.emit(ClientStageEvents.ADD_STAGE, payload);
        }
    }, [socket]);

    const updateStage = useCallback((id: StageId, stage: Partial<Server.Stage>) => {
        if (socket) {
            const payload: ChangeStagePayload = {
                id: id,
                update: stage
            }
            socket.emit(ClientStageEvents.CHANGE_STAGE, payload);
        }
    }, [socket]);

    const joinStage = useCallback((stageId: StageId, groupId: GroupId, password: string): Promise<void> => {
        if (socket) {
            const payload: JoinStagePayload = {
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
            const payload: AddGroupPayload = {
                stageId: stageId,
                name: name
            }
            socket.emit(ClientStageEvents.ADD_GROUP, payload);
        }
    }, [socket]);

    const updateGroup = useCallback((id: GroupId, update: Partial<Server.Group>) => {
        if (socket) {
            const payload: ChangeGroupPayload = {
                id: id,
                update: update
            }
            socket.emit(ClientStageEvents.CHANGE_GROUP, payload);
        }
    }, [socket]);

    const removeGroup = useCallback((id: GroupId) => {
        if (socket) {
            socket.emit(ClientStageEvents.REMOVE_GROUP, id);
        }
    }, [socket]);

    const updateStageMember = useCallback((id: StageMemberId, update: Partial<Server.StageMember>) => {
        if (socket) {
            const payload: ChangeStageMemberPayload = {
                id: id,
                update: update
            }
            socket.emit(ClientStageEvents.CHANGE_STAGE_MEMBER, payload);
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


    return (
        <StagesContext.Provider value={{
            // States
            stageId: stageId,
            stage: stage,
            availableStages: stages,
            groups: groups,
            customGroups: customGroups,
            users: users,
            stageMembers: stageMembers,
            customStageMembers: customStageMembers,
            audioProducers: audioProducers,
            customAudioProducers: customAudioProducers,
            videoProducers: videoProducers,
            ovTracks: ovTracks,
            customOvTracks: customOvTracks,

            arrUsers,
            arrAvailableStages,
            arrAudioProducers,
            arrCustomAudioProducers,
            arrCustomGroups,
            arrCustomOvTracks,
            arrCustomStageMembers,
            arrGroups,
            arrOvTracks,
            arrStageMembers,
            arrVideoProducers,

            // Methods
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