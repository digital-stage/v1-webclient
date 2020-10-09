import Container from "../components/theme/Container";
import React, {useEffect, useState} from "react";
import {useAuth} from "../lib/digitalstage/useAuth";
import Loading from "../components/theme/Loading";
import {DisplayMedium, HeadingLarge} from "baseui/typography";
import Login from "./account/login";
import StageListView from "../components/stage/StageListView";
import useStageSelector from "../lib/digitalstage/useStageSelector";
import {useRouter} from "next/router";


const Stages = () => {
    const router = useRouter();
    const {loading, user} = useAuth();
    const {current} = useStageSelector(state => {
        return {current: state.current}
    });
    const [initialized, setInitialized] = useState<boolean>();

    useEffect(() => {
        if (initialized) {
            if (current) {
                router.push("/");
            }
        }
    }, [current]);

    useEffect(() => {
        if (router.pathname === "/stages") {
            setInitialized(true);
        }
    }, [router.pathname]);

    if (!loading) {
        if (!user) {
            return <Login/>
        } else {
            return (
                <Container>
                    <HeadingLarge>Meine Bühnen</HeadingLarge>
                    <StageListView/>
                </Container>
            );
        }
    }

    return <Loading>
        <DisplayMedium>Lade ...</DisplayMedium>
    </Loading>;
}
export default Stages;