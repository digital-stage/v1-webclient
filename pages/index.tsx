import {DisplayMedium} from "baseui/typography";
import React from "react";
import {useAuth} from "../lib/digitalstage/useAuth";
import Loading from "../components/theme/Loading";
import {useRouter} from "next/router";
import useStageSelector from "../lib/digitalstage/useStageSelector";
import StageView from "../components/stage/StageView";

const Index = () => {
    const {stage} = useStageSelector(state => {
        return {
            stage: state.current ? state.stages.byId[state.current.stageId] : undefined
        }
    })
    const router = useRouter();

    const {loading, user} = useAuth();

    if (!loading) {
        if (!user) {
            router.push("/account/login");
        } else {
            if (!stage) {
                router.push("/stages");
            } else {
                return <StageView stage={stage}/>;
            }
        }
    }

    return <Loading>
        <DisplayMedium>Lade ...</DisplayMedium>
    </Loading>;
}
export default Index;