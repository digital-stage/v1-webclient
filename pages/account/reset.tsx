import {useRouter} from "next/router";
import {useAuth} from "../../lib/digitalstage/useAuth";
import React from "react";
import ResetForm from "../../components/account/ResetForm";
import Loading from "../../components/theme/Loading";
import {HeadingLarge} from "baseui/typography";
import Container from "../../components/theme/Container";

const Reset = () => {
    const router = useRouter();
    const {loading, user} = useAuth();
    const {token} = router.query;

    if (!loading) {
        if (user) {
            router.push("/");
        } else {
            return (
                <Container>
                    <HeadingLarge>Passwort zurücksetzen</HeadingLarge>
                    {token && !Array.isArray(token) && (
                        <ResetForm resetToken={token}/>
                    )}
                </Container>
            )
        }
    }

    return <Loading><HeadingLarge>Lade...</HeadingLarge></Loading>;
};

export default Reset;