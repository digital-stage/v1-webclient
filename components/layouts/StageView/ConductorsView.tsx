import useStageSelector, {useConductors} from "../../../lib/digitalstage/useStageSelector";
import {StageMember} from "../../../lib/digitalstage/common/model.server";
import {Stage, VideoConsumer} from "../../../lib/digitalstage/useStageContext/model";
import CanvasPlayer from "../../experimental/CanvasPlayer";
import React from "react";
import {useStyletron} from "styletron-react";
import StageMemberView from "./StageMemberView";

const ConductorsView = () => {
    const [css] = useStyletron();
    const conductors = useConductors();

    if (conductors.length > 0) {
        return (
            <div className={css({
                position: "fixed",
                top: "10vh",
                left: "10vw",
                width: "80vw",
                height: "80vh",
                backgroundColor: "black"
            })}>
                <div className={css({
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start'
                })}>
                    {conductors.map(conductor => (
                        <StageMemberView key={conductor._id} stageMember={conductor}/>
                    ))}
                </div>
            </div>
        )
    }
    return null;
};

export default ConductorsView;