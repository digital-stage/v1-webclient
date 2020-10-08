import {useEffect, useState} from "react";
import ClientModel from "../common/model.client";
import {useStages} from "../useStages";
import {useAuth} from "../useAuth";


const useStageModel = (): {
    stages: ClientModel.Stage[],
    stage?: ClientModel.Stage
} => {
    const {user} = useAuth();
    const {stageId, availableStages, groups, customGroups, stageMembers, users, customStageMembers, ovTracks} = useStages();
    //const {audioConsumers, videoConsumers} = useMediasoup();
    const [stages, setStages] = useState<ClientModel.Stage[]>([]);
    const [stage, setStage] = useState<ClientModel.Stage>();

    // Resolve stage objects
    useEffect(() => {
        const stages: ClientModel.Stage[] = availableStages.map(stagePrototype => {
            const stage: ClientModel.Stage = {
                ...stagePrototype,
                groups: groups.filter(groupPrototype => groupPrototype.stageId === stagePrototype._id).map(groupPrototype => {
                    const customVolume = customGroups[groupPrototype._id];
                    const group: ClientModel.Group = {
                        ...groupPrototype,
                        customVolume: customVolume ? customVolume.volume : undefined,
                        members: stageMembers.filter(groupMemberPrototype => groupMemberPrototype.groupId === groupPrototype._id).map(groupMemberPrototype => {
                            const customVolume = customStageMembers[groupMemberPrototype._id];
                            const member: ClientModel.StageMember = {
                                ...groupMemberPrototype,
                                name: users[groupMemberPrototype.userId] && users[groupMemberPrototype.userId].name,
                                avatarUrl: users[groupMemberPrototype.userId] && users[groupMemberPrototype.userId].avatarUrl,
                                customVolume: customVolume ? customVolume.volume : undefined,
                                //audioConsumers: audioConsumers.filter(consumer => consumer.userId === groupMemberPrototype.userId),
                                //videoConsumers: videoConsumers.filter(consumer => consumer.userId === groupMemberPrototype.userId),
                                audioConsumers: [],
                                videoConsumers: [],
                                ovTracks: ovTracks.filter(track => track.userId === groupMemberPrototype.userId)
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
    }, [user, availableStages, groups, stageMembers, customGroups, customStageMembers, ovTracks]);

    /*
    useEffect(() => {
        if (stageId) {
            setStage(stages.find(stage => stage._id === stageId.stageId));
        } else {
            setStage(undefined);
        }
    }, [stageId])*/

    return {
        stages,
        stage
    }
}
export default useStageModel;