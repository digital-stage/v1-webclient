import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {useAuth} from "../../lib/digitalstage/useAuth";
import Login from "../../components/digital-stage-sign-in";

const LoginScreen = () => {
    const router = useRouter();
    const {loading, user} = useAuth();

    useEffect(() => {
        router.prefetch("/account/signup");
        router.prefetch("/account/forgot");
    }, []);

    if (!loading) {
        if (user) {
            router.push("/");
        }
    }

    return <Login mode="login"/>
};
export default LoginScreen;