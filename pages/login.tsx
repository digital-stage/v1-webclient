import Link from "next/link";
import React, {useEffect} from "react";
import LoginForm from "../components/account/LoginForm";
import {useAuth} from "../lib/digitalstage/useAuth";
import {useRouter} from "next/router";

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
        <>
            <LoginForm/>
            oder <Link href="/signup"><a>erstelle ein Konto</a></Link>
        </>
    )
};
export default Login;