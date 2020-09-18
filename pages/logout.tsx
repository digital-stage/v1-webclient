import React, {useEffect, useState} from "react";
import Container from "../components/theme/Container";
import {useAuth} from "../lib/digitalstage/useAuth";
import {DisplayMedium, HeadingLarge} from "baseui/typography";
import Loading from "../components/theme/Loading";

const Logout = () => {
    const [loggedOut, setLoggedOut] = useState<boolean>(false);
    const {logout} = useAuth();

    useEffect(() => {
        logout();
        setLoggedOut(true);
    })

    if (loggedOut) {
        return (
            <Container>
                <HeadingLarge>Abgemeldet!</HeadingLarge>
            </Container>
        );
    }

    return (
        <Loading>
            <DisplayMedium>Melde ab...</DisplayMedium>
        </Loading>
    );
}
export default Logout;