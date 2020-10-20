import {DisplayMedium} from "baseui/typography";
import React from "react";
import {useAuth} from "../lib/digitalstage/useAuth";
import Loading from "../components/complex/depreacted/theme/Loading";
import {useRouter} from "next/router";
import StageView from "../components/complex/depreacted/stage/StageView";
import useStageSelector from "../lib/digitalstage/useStageSelector";
import {Stages} from "../lib/digitalstage/useStageContext/schema";

const Index = () => {
    const stageId = useStageSelector<string | undefined>(state => state.stageId);
    const stages = useStageSelector<Stages>(state => state.stages);
    const router = useRouter();

    const {loading, user} = useAuth();

    if (!loading) {
        if (!user) {
            router.push("/account/login");
        } else {
            if (!stageId) {
                router.push("/stages");
            } else {
                return <StageView stage={stages.byId[stageId]}/>;
            }
        }
    }

    return <Loading>
        <DisplayMedium>Lade ...</DisplayMedium>
    </Loading>;
}
export default Index;