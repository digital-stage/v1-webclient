import Link from "next/link";
import React, {useEffect} from "react";
import LoginForm from "../components/account/LoginForm";
import {useAuth} from "../lib/digitalstage/useAuth";
import {useRouter} from "next/router";
import Container from "../components/theme/Container";
import {HeadingLarge, ParagraphMedium} from "baseui/typography";
import TextLink from "../components/theme/TextLink";

const Login = () => {
    const {user} = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Prefetch the dashboard page
        router.prefetch('/')
    }, []);

    if (user) {
        router.push("/");
    }

    return (
        <Container>
            <HeadingLarge>Anmeldung</HeadingLarge>
            <LoginForm/>
            <ParagraphMedium>
                oder <TextLink animateUnderline href="/signup">erstelle ein Konto</TextLink>
            </ParagraphMedium>
        </Container>
    )
};
export default Login;