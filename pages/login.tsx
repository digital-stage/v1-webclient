import React, {useEffect} from "react";
import LoginForm from "../components/account/LoginForm";
import Container from "../components/theme/Container";
import {HeadingLarge, ParagraphMedium} from "baseui/typography";
import TextLink from "../components/theme/TextLink";
import {useRouter} from "next/router";
import {useAuth} from "../lib/digitalstage/useAuth";
import Loading from "../components/theme/Loading";

const Login = () => {
    const router = useRouter();
    const {loading, user} = useAuth();

    useEffect(() => {
        router.prefetch("/signup");
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
                        oder <TextLink animateUnderline href="/signup">erstelle ein Konto</TextLink>
                    </ParagraphMedium>
                </Container>
            )
        }
    }

    return <Loading><HeadingLarge>Melde an...</HeadingLarge></Loading>;
};
export default Login;