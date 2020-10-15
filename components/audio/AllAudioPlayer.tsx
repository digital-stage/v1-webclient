import React from "react";
import {useSelector} from "../../lib/digitalstage/useStageContext/redux";
import {AudioConsumers, NormalizedState} from "../../lib/digitalstage/useStageContext/schema";


export const AllAudioPlayer = () => {
    const stageId = useSelector<NormalizedState, string | undefined>(state => state.stageId);
    const audioConsumers = useSelector<NormalizedState, AudioConsumers>(state => state.audioConsumers);


    return (
        <>
            {stageId && audioConsumers.byStage[stageId]
                .map(id => audioConsumers.byId[id])
                .map(audioConsumer => (
                    <div>
                        AUDIO CONSUMER
                    </div>
                ))
            }
        </>
    )
};
