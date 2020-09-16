import React from "react";
import {useRouter} from "next/router";
import {useRequest} from "../../../lib/useRequest";
import Loading from "../../../components/theme/Loading";

const Join = () => {
    const router = useRouter()
    const {stageId, groupId} = router.query;

    const {setRequest} = useRequest();

    if (stageId && groupId) {
        setRequest(stageId, groupId);
        router.push("/");
    }

    return (
        <Loading>
            Willkommen
        </Loading>
    )
}

export default Join;