import React, {useEffect} from "react";
import Loading from "../components/complex/depreacted/theme/Loading";
import useStageActions from "../lib/digitalstage/useStageActions";
import {useRouter} from "next/router";
import useStageSelector from "../lib/digitalstage/useStageSelector";
import {Typography} from "@material-ui/core";

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
            <Typography variant="h1">Verlasse Bühne...</Typography>
        </Loading>
    );
}
export default Leave;