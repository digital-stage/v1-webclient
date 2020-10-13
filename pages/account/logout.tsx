import React, {useEffect, useState} from "react";
import Container from "../../components/theme/layout/Container";
import {useAuth} from "../../lib/digitalstage/useAuth";
import {DisplayMedium, HeadingLarge} from "baseui/typography";
import Loading from "../../components/theme/Loading";
import {useRouter} from "next/router";

const Logout = () => {
    const router = useRouter();
    const [loggedOut, setLoggedOut] = useState<boolean>(false);
    const {logout, loading} = useAuth();

    useEffect(() => {
        logout()
            .then(() => {
                setLoggedOut(true);
                router.push("/account/login");
            })
    }, []);

    if (!loading) {
        if (loggedOut) {
            return (
                <Container>
                    <HeadingLarge>Abgemeldet!</HeadingLarge>
                </Container>
            );
        }
    }
    return (
        <Loading>
            <DisplayMedium>Melde ab...</DisplayMedium>
        </Loading>
    );
}
export default Logout;