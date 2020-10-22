import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/digitalstage/useAuth";
import SideDrawer from "./SideDrawer";

const Drawer = () => {
    const router = useRouter();
    const { loading, user } = useAuth();

    useEffect(() => {
        router.prefetch("/navigation/SideDrawer");
        console.log(user)
    }, []);


    return user ? <SideDrawer/> : null
};
export default Drawer;