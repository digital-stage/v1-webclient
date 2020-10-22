import {useStyletron} from "baseui";
import React, {useEffect, useState} from "react";
import {Layer} from "baseui/layer";
import {
    NO_USER_NAV,
    SHOW_ALL_STAGES,
    SHOW_LOCAL_AND_REMOTE_DEVICES, SHOW_LOCAL_DEVICE_ONLY,
    USER_NAV,
} from "./navs";
import {
    AppNavBar, NavItemT
} from 'baseui/app-nav-bar';
import {useRouter} from "next/router";
import TextLink from "../theme/TextLink";
import {Delete, Filter} from "baseui/icon";
import {useAuth} from "../../../../lib/digitalstage/useAuth";
import {Devices, Stages} from "../../../../lib/digitalstage/useStageContext/schema";
import {LocalUser} from "../../../../lib/digitalstage/useStageContext/model";
import useStageSelector from "../../../../lib/digitalstage/useStageSelector";


const AppNavigation = () => {
    const [css] = useStyletron();
    const containerStyles = css({
        boxSizing: 'border-box',
        width: '100vw',
        position: 'fixed',
        top: '0',
        left: '0',
    });
    const {user: authUser} = useAuth();
    const [mainNav, setMainNav] = useState<NavItemT[]>([]);
    const [userNav, setUserNav] = useState<NavItemT[]>([]);
    const [activeNavItem, setActiveNavItem] = useState<NavItemT>();

    const router = useRouter();
    const stageId = useStageSelector<string | undefined>(state => state.stageId);
    const stages = useStageSelector<Stages>(state => state.stages);
    const user = useStageSelector<LocalUser | undefined>(state => state.user);
    const devices = useStageSelector<Devices>(state => state.devices);

    useEffect(() => {
        let activeNavItem = mainNav.find(nav => nav.info.path === router.pathname);
        if (!activeNavItem)
            activeNavItem = userNav.find(nav => nav.info.path === router.pathname);
        setActiveNavItem(activeNavItem);
    }, [router.pathname])

    useEffect(() => {
        if (user) {
            const nav: NavItemT[] = [];
            if (stageId) {
                nav.push({
                    icon: () => <img src="crop_landscape-24px.svg"/>,
                    label: stages.byId[stageId].name,
                    info: {
                        path: '/'
                    }
                });
                nav.push({
                    icon: () => <Filter/>,
                    label: "Mischpult",
                    info: {
                        path: '/mixer'
                    }
                });
                nav.push({
                    icon: () => <Delete/>,
                    label: stages.byId[stageId].name + " verlassen",
                    info: {
                        path: '/leave'
                    }
                });
            }
            nav.push(SHOW_ALL_STAGES);
            if (devices.remote.length > 0) {
                nav.push(SHOW_LOCAL_AND_REMOTE_DEVICES);
            } else {
                nav.push(SHOW_LOCAL_DEVICE_ONLY);
            }
            setMainNav(nav);
            setUserNav(USER_NAV);
        } else {
            setUserNav([]);
            setMainNav(NO_USER_NAV);
        }
    }, [user, stageId, stages.byId, devices.remote])

    if(authUser)
    return (
        <Layer>
            <div className={containerStyles}>
                <AppNavBar
                    title={<TextLink hideUnderline={true} href={"/"}>Digital Stage</TextLink>}
                    mainItems={mainNav}
                    onMainItemSelect={(item) => {
                        if (item === activeNavItem) return;
                        setActiveNavItem(item);
                        if (item.info && item.info.path) {
                            router.push(item.info.path);
                        }
                    }}
                    userItems={userNav}
                    username={user && user.name}
                    usernameSubtitle={authUser && authUser.email}
                    userImgUrl={user && user.avatarUrl}
                />
            </div>
        </Layer>
    );
    return null;
};
export default AppNavigation;