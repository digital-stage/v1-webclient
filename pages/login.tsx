import Link from "next/link";
import React from "react";
import LoginForm from "../components/account/LoginForm";
import {useAuth} from "../lib/digitalstage/useAuth";
import {useRouter} from "next/router";

const Login = () => {
    const {user} = useAuth();
    const router = useRouter();

    if( user ) {
        router.push("/");
    }

    return (
        <>
            <LoginForm/>
            oder <Link href="/signup"><a>erstelle ein Konto</a></Link>
        </>
    )
};
export default Login;