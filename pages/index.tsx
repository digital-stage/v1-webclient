import React, {useEffect} from "react";
import {useAuth} from "../lib/digitalstage/useAuth";
import Loading from "../components/complex/depreacted/theme/Loading";
import {useRouter} from "next/router";
import useStageSelector from "../lib/digitalstage/useStageSelector";
import {Stages} from "../lib/digitalstage/useStageContext/schema";
import StageView from "../components/layouts/StageView";
import {Typography} from "@material-ui/core";

const Index = () => {
    const stageId = useStageSelector<string | undefined>(state => state.stageId);
    const stages = useStageSelector<Stages>(state => state.stages);
    const router = useRouter();

    const {loading, user} = useAuth();

    if (!loading) {
        if (!user) {
            console.log("[Page:index] Forwarding to welcome screen");
            router.push("/account/welcome");
        } else {
            if (!stageId) {
                console.log("[Page:index] Forwarding to stages");
                router.push("/stages");
            } else {
                console.log("[Page:index] Showing stage directly");
                router.prefetch("/devices");
                router.prefetch("/mixer");
                return <StageView stage={stages.byId[stageId]}/>;
            }
        }
    }

    return <Loading>
        <Typography variant="h1">Lade ...</Typography>
    </Loading>;
}
export default Index;