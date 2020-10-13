import React from "react";
import {useStageState} from "../../lib/digitalstage/useStageContext";


export const AllAudioPlayer = () => {
    const {stageId, audioConsumers} = useStageState();


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
