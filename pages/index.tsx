import {DisplayMedium} from "baseui/typography";
import React from "react";
import {useAuth} from "../lib/digitalstage/useAuth";
import Loading from "../components/theme/Loading";
import {useRouter} from "next/router";
import StageView from "../components/stage/StageView";
import {useStageState} from "../lib/digitalstage/useStageContext";

const Index = () => {
    const {stageId, stages} = useStageState();
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