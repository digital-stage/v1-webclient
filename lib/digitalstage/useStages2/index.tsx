import React, {useCallback, useEffect, useState} from "react";
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
import debounce from "lodash.debounce";
import {Group, InitialStagePackage, Stage, User, UserId} from "./../common/model.server";
import {Client2} from "../common/model.client";

export interface StagesProps {
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
    const [users, setUsers] = useState<Server.User[]>([]);
    const [stages, setStages] = useState<Server.Stage[]>([]);
    const [groups, setGroups] = useState<Server.Group[]>([]);

    // Single stage data
    const [stage, setStage] = useState<Client2.Stage>();
    const [stageId, setStageId] = useState<{ stageId: StageId, groupId: GroupId }>();
    const [customGroups, setCustomGroups] = useState<Server.CustomGroup[]>([]);
    const [stageMembers, setStageMembers] = useState<Server.StageMember[]>([]);
    const [customStageMembers, setCustomStageMembers] = useState<Server.CustomStageMember[]>([]);
    const [audioProducers, setAudioProducers] = useState<Server.StageMemberAudioProducer[]>([]);
    const [customAudioProducers, setCustomAudioProducers] = useState<Server.CustomStageMemberAudioProducer[]>([]);
    const [videoProducers, setVideoProducers] = useState<Server.StageMemberVideoProducer[]>([]);
    const [ovTracks, setOvTracks] = useState<Server.StageMemberOvTrack[]>([]);
    const [customOvTracks, setCustomOvTracks] = useState<Server.CustomStageMemberOvTrack[]>([]);

    const handleStageJoined = useCallback((payload: InitialStagePackage) => {
        setUsers(payload.users);
        if (payload.stage) {
            setStage({
                ...payload.stage,
                isAdmin: payload.stage.admins.find(admin => user._id === admin) !== undefined
            });
        } else {
            const stage: Server.Stage = stages.find(stage => stage._id === payload.stageId);
            setStage({
                ...stage,
                isAdmin: payload.stage.admins.find(admin => user._id === admin) !== undefined
            });
        }
        if (payload.groups) {
            setGroups(prevState => [...prevState, ...payload.groups]);
        }
        setCustomGroups(payload.customGroups);
        setStageMembers(payload.stageMembers);
        setCustomStageMembers(payload.customStageMembers);
        setVideoProducers(payload.videoProducers);
        setAudioProducers(payload.audioProducers);
        setCustomAudioProducers(payload.customAudioProducers);
        setOvTracks(payload.ovTracks);
        setCustomOvTracks(payload.customOvTracks);
        setStageId({
            stageId: payload.stageId,
            groupId: payload.groupId
        });
    }, [stages]);

    useEffect(() => {
        if (socket) {
            socket.on(ServerStageEvents.STAGE_JOINED, (payload: InitialStagePackage) => handleStageJoined(payload));

            socket.on(ServerStageEvents.USER_ADDED, (payload: User) => {
                setUsers(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.USER_CHANGED, (payload: User) => {
                setUsers(prevState => prevState.map(user => user._id === payload._id ? {
                    ...user,
                    ...payload
                } : user));
            });
            socket.on(ServerStageEvents.USER_REMOVED, (payload: UserId) => {
                setUsers(prevState => prevState.filter(user => user._id !== payload));
            });

            socket.on(ServerStageEvents.STAGE_ADDED, (payload: Stage) => {
                setStages(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.STAGE_CHANGED, (payload: User) => {
                setStages(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.STAGE_REMOVED, (payload: UserId) => {
                setStages(prevState => prevState.filter(stage => stage._id !== payload));
            });

            socket.on(ServerStageEvents.GROUP_ADDED, (payload: Server.Group) => {
                setGroups(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.GROUP_CHANGED, (payload: Server.Group) => {
                setGroups(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.GROUP_REMOVED, (payload: Server.GroupId) => {
                setGroups(prevState => prevState.filter(el => el._id !== payload));
            });

            socket.on(ServerStageEvents.CUSTOM_GROUP_ADDED, (payload: Server.CustomGroup) => {
                setCustomGroups(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_CHANGED, (payload: Server.CustomGroup) => {
                setCustomGroups(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_REMOVED, (payload: Server.CustomGroupId) => {
                setCustomGroups(prevState => prevState.filter(el => el._id !== payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_ADDED, (payload: Server.StageMember) => {
                setStageMembers(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_CHANGED, (payload: Server.StageMember) => {
                setStageMembers(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_REMOVED, (payload: Server.StageMemberId) => {
                setStageMembers(prevState => prevState.filter(el => el._id !== payload));
            });


            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED, (payload: Server.CustomGroup) => {
                setCustomGroups(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_CHANGED, (payload: Server.CustomGroup) => {
                setCustomGroups(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.CUSTOM_GROUP_REMOVED, (payload: Server.CustomGroupId) => {
                setCustomGroups(prevState => prevState.filter(el => el._id !== payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED, (payload: Server.StageMemberVideoProducer) => {
                setVideoProducers(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED, (payload: Server.StageMemberVideoProducer) => {
                setVideoProducers(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED, (payload: Server.StageMemberVideoProducerId) => {
                setVideoProducers(prevState => prevState.filter(el => el._id !== payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED, (payload: Server.StageMemberAudioProducer) => {
                setAudioProducers(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED, (payload: Server.StageMemberAudioProducer) => {
                setAudioProducers(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED, (payload: Server.StageMemberAudioProducerId) => {
                setAudioProducers(prevState => prevState.filter(el => el._id !== payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED, (payload: Server.StageMemberAudioProducer) => {
                setAudioProducers(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.StageMemberAudioProducer) => {
                setAudioProducers(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.StageMemberAudioProducerId) => {
                setAudioProducers(prevState => prevState.filter(el => el._id !== payload));
            });

            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED, (payload: Server.CustomStageMemberAudioProducer) => {
                setCustomAudioProducers(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED, (payload: Server.CustomStageMemberAudioProducer) => {
                setCustomAudioProducers(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED, (payload: Server.CustomStageMemberAudioProducerId) => {
                setCustomAudioProducers(prevState => prevState.filter(el => el._id !== payload));
            });

            socket.on(ServerStageEvents.STAGE_MEMBER_OV_ADDED, (payload: Server.StageMemberOvTrack) => {
                setOvTracks(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_OV_CHANGED, (payload: Server.StageMemberOvTrack) => {
                setOvTracks(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.STAGE_MEMBER_OV_REMOVED, (payload: Server.StageMemberOvTrackId) => {
                setOvTracks(prevState => prevState.filter(el => el._id !== payload));
            });

            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED, (payload: Server.CustomStageMemberOvTrack) => {
                setCustomOvTracks(prevState => [...prevState, payload])
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED, (payload: Server.CustomStageMemberOvTrack) => {
                setCustomOvTracks(prevState => prevState.map(el => el._id === payload._id ? {
                    ...el,
                    ...payload
                } : el));
            });
            socket.on(ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED, (payload: Server.CustomStageMemberOvTrackId) => {
                setCustomOvTracks(prevState => prevState.filter(el => el._id !== payload));
            });


            return () => {
                setUsers([]);
                setStages([]);
                setGroups([]);
                setCustomGroups([]);
                setStageMembers([]);
                setCustomStageMembers([]);
                setAudioProducers([]);
                setVideoProducers([]);
                setOvTracks([]);
                setOvTracks([]);
            }
        }
    }, [socket]);


    return (
        <StagesContext.Provider value={{
            stage,
            stageId,
        }}>
            {props.children}
        </StagesContext.Provider>
    );
}