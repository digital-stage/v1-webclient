import React, {useEffect} from "react";
import LoginForm from "../../components/account/LoginForm";
import Container from "../../components/theme/layout/Container";
import {HeadingLarge, ParagraphMedium} from "baseui/typography";
import TextLink from "../../components/theme/TextLink";
import {useRouter} from "next/router";
import {useAuth} from "../../lib/digitalstage/useAuth";
import Loading from "../../components/theme/Loading";

const Login = () => {
    const router = useRouter();
    const {loading, user} = useAuth();

    useEffect(() => {
        router.prefetch("/account/signup");
        router.prefetch("/account/forgot");
    }, []);

    if (!loading) {
        if (user) {
            router.push("/");
        } else {
            return (
                <Container>
                    <HeadingLarge>Anmeldung</HeadingLarge>
                    <LoginForm/>
                    <ParagraphMedium>
                        oder <TextLink animateUnderline href="/account/signup">erstelle ein Konto</TextLink>
                    </ParagraphMedium>
                    <ParagraphMedium>
                        Passwort vergessen? <TextLink animateUnderline href="/account/forgot">Setze es hier zurück!</TextLink>
                    </ParagraphMedium>
                </Container>
            )
        }
    }

    return <Loading><HeadingLarge>Melde an...</HeadingLarge></Loading>;
};
export default Login;