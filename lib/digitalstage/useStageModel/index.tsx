import {useEffect, useState} from "react";
import ClientModel from "../common/model.client";
import {useStages} from "../useStages";
import {useAuth} from "../useAuth";


const useStageModel = (): {
    stages: ClientModel.Stage[],
    stage?: ClientModel.Stage
} => {
    const {user} = useAuth();
    const {state} = useStages();
    const [stages, setStages] = useState<ClientModel.Stage[]>([]);
    const [stage, setStage] = useState<ClientModel.Stage>();

    // Resolve stage objects
    useEffect(() => {
        const stages: ClientModel.Stage[] = state.stages.allIds.map(stageId => {
            const stage: ClientModel.Stage = {
                ...state.stages.byId[stageId],
                groups: state.stages.byId[stageId].groups.map(groupId => {
                    const customVolume = state.groups.byId[groupId].customGroup ? state.customGroups.byId[state.groups.byId[groupId].customGroup] : undefined;
                    const group: ClientModel.Group = {
                        ...state.groups.byId[groupId],
                        customVolume: customVolume ? customVolume.volume : undefined,
                        members: state.groups.byId[groupId].stageMembers.map(stageMemberId => {
                            const customVolume = state.stageMembers.byId[stageMemberId].customStageMember ? state.customStageMembers.byId[state.stageMembers.byId[stageMemberId].customStageMember].volume : undefined;
                            const user = state.stageMembers.byId[stageMemberId].userId ? state.users.byId[state.stageMembers.byId[stageMemberId].userId] : undefined;
                            const member: ClientModel.StageMember = {
                                ...state.stageMembers.byId[stageMemberId],
                                name: user && user.name,
                                avatarUrl: user && user.avatarUrl,
                                customVolume: customVolume,
                                //audioConsumers: audioConsumers.filter(consumer => consumer.userId === groupMemberPrototype.userId),
                                //videoConsumers: videoConsumers.filter(consumer => consumer.userId === groupMemberPrototype.userId),
                                audioConsumers: [],
                                videoConsumers: [],
                                ovTracks: state.stageMembers.byId[stageMemberId].ovTracks.map(trackId => state.ovTracks.byId[trackId])
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
    }, [user, state]);

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