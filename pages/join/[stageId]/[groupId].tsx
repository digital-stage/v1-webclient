import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {useRequest} from "../../../lib/useRequest";
import Loading from "../../../components/complex/depreacted/theme/Loading";
import {DisplayMedium} from "baseui/typography";

const Join = () => {
    const router = useRouter()

    const {setRequest} = useRequest();

    useEffect(() => {
        router.prefetch('/');
    }, []);

    useEffect(() => {
        if (router.query) {
            const {stageId, groupId, password} = router.query;
            if (stageId
                && groupId
                && !Array.isArray(stageId)
                && !Array.isArray(groupId)) {
                if( password && !Array.isArray(password) ) {
                    setRequest(stageId, groupId, password);
                } else {
                    setRequest(stageId, groupId);
                }
                router.push("/");
            }
        }
    }, [router.query]);

    return <Loading><DisplayMedium>Lade...</DisplayMedium></Loading>
}

export default Join;