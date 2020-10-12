import {useStyletron} from "baseui";
import React from "react";
import {useStageState} from "../lib/digitalstage/useStageContext";

const Debug = () => {
    const [css] = useStyletron();
    const state = useStageState();

    return (
        <div className={css({
            width: "100%",
        })}>
            <pre>
                {JSON.stringify(state, null, 2)}
            </pre>
        </div>
    )
}
export default Debug;