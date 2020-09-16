import React from "react";
import {useRouter} from "next/router";
import {useRequest} from "../../../lib/useRequest";
import Loading from "../../../components/theme/Loading";
import {DisplayMedium} from "baseui/typography";
import Error from 'next/error';

const Join = () => {
    const router = useRouter()
    const {stageId, groupId} = router.query;

    const {setRequest} = useRequest();

    if (stageId
        && groupId
        && !Array.isArray(stageId)
        && !Array.isArray(groupId)) {
        setRequest(stageId, groupId);
        router.push("/");
        return <Loading><DisplayMedium>Lade...</DisplayMedium></Loading>
    }
    return (
        <Error statusCode={404}/>
    )
}

export default Join;