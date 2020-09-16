import Link from "next/link";
import React, {useEffect} from "react";
import SignUpForm from "../components/account/SignUpForm";
import {useAuth} from "../lib/digitalstage/useAuth";
import {useRouter} from "next/router";

const SignUp = () => {
    const {user} = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Prefetch the dashboard page
        router.prefetch('/')
    }, []);

    if( user ) {
        router.push("/");
    }

    return (
        <>
            <SignUpForm/>
            oder <Link href="/login"><a>melde Dich an</a></Link>
        </>
    )
};
export default SignUp;