import React from "react";
import {useStageState} from "../../lib/digitalstage/useStageContext";


export const AllAudioPlayer = () => {
    const {stageMembers} = useStageState();


    return (
        <>
            {stageMembers.allIds.map(id => {
                return stageMembers.byId[id].audioProducers.map(
                    audioProducer => {
                        return (
                            <div>

                            </div>
                        )
                    }
                )
            })}
        </>
    )
};
