import Link from "next/link";
import React, {useEffect} from "react";
import SignUpForm from "../components/account/SignUpForm";
import {useAuth} from "../lib/digitalstage/useAuth";
import {useRouter} from "next/router";
import Container from "../components/theme/Container";
import {HeadingLarge, ParagraphMedium} from "baseui/typography";
import TextLink from "../components/theme/TextLink";

const SignUp = () => {
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
            <HeadingLarge>Registration</HeadingLarge>
            <SignUpForm/>
            <ParagraphMedium>
                oder <TextLink animateUnderline href="/login">melde Dich an</TextLink>
            </ParagraphMedium>
        </Container>
    )
};
export default SignUp;