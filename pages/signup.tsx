import Link from "next/link";
import React from "react";
import SignUpForm from "../components/account/SignUpForm";
import {useAuth} from "../lib/useAuth";
import {useRouter} from "next/router";

const SignUp = () => {
    const {user} = useAuth();
    const router = useRouter();

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