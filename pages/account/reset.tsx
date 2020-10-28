import {useRouter} from "next/router";
import {useAuth} from "../../lib/digitalstage/useAuth";
import React from "react";
import ResetForm from "../../components/complex/depreacted/account/ResetForm";
import Loading from "../../components/complex/depreacted/theme/Loading";
import {HeadingLarge} from "baseui/typography";
import Container from "../../components/complex/depreacted/theme/layout/Container";
import {Typography} from "@material-ui/core";
import ResetPassword from "../../components/digital-stage-sign-in/ResetPassword";

const Reset = () => {
    const router = useRouter();
    const {loading, user} = useAuth();
    const {token} = router.query;

    if (!loading) {
        if (user) {
            router.push("/");
        } else {
            return (
                // <Container>
                //     <HeadingLarge>Passwort zurücksetzen</HeadingLarge>
                    <>{token && !Array.isArray(token) && (
                        // <ResetForm resetToken={token}/>
                        <ResetPassword resetToken={token} targetUrl="/account/login"/>
                    )}</>
                // </Container>
            )
        }
    }

    return <Loading><Typography variant="h1">Lade...</Typography></Loading>;
};

export default Reset;