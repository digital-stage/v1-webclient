import {DisplayMedium} from "baseui/typography";
import React from "react";
import {useAuth} from "../lib/digitalstage/useAuth";
import Loading from "../components/theme/Loading";
import {useRouter} from "next/router";
import GroupGrid from "../components/stage/GroupGrid";
import {useStageSelector} from "../lib/digitalstage/useStages";

const Index = () => {
    const {stage, groups} = useStageSelector(state => {
        return {
            stage: state.current ? state.stages.byId[state.current.stageId] : undefined,
            groups: state.groups
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
                return stage.groups.map(groupId => {
                    const group = groups.byId[groupId];
                    return (
                        <>
                            <DisplayMedium>{group.name}</DisplayMedium>
                            <GroupGrid group={group}/>
                        </>
                    )
                })
            }
        }
    }

    return <Loading>
        <DisplayMedium>Lade ...</DisplayMedium>
    </Loading>;
}
export default Index;