import {DisplaySmall} from "baseui/typography";
import React, {useEffect} from "react";
import Loading from "../components/theme/Loading";
import useStageActions from "../lib/digitalstage/useStageActions";
import {useRouter} from "next/router";
import useStageSelector from "../lib/digitalstage/useStageSelector";

const Leave = () => {
    const router = useRouter();
    const ready = useStageSelector<boolean>(state => state.ready);
    const stageId = useStageSelector<string | undefined>(state => state.stageId);
    const {leaveStage} = useStageActions();

    useEffect(() => {
        if (ready) {
            if (stageId)
                leaveStage();
            else
                router.push("/stages")
        }

    }, [ready, stageId]);

    return (
        <Loading>
            <DisplaySmall>Verlasse Bühne...</DisplaySmall>
        </Loading>
    )
}
export default Leave;