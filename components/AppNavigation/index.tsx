import {useStyletron} from "baseui";
import React, {useEffect, useState} from "react";
import {Layer} from "baseui/layer";
import {
    MainNavItem,
    NO_USER_NAV,
    SHOW_ALL_STAGES,
    SHOW_LOCAL_AND_REMOTE_DEVICES, SHOW_LOCAL_DEVICE_ONLY,
    USER_NAV,
    UserNavItem
} from "./navs";
import {isActive, renderItem} from "./util";
import {
    Unstable_AppNavBar as AppNavBar
} from 'baseui/app-nav-bar';
import {useRouter} from "next/router";
import TextLink from "../theme/TextLink";
import {Delete} from "baseui/icon";
import {useStageState} from "../../lib/digitalstage/useStageContext";
import {useAuth} from "../../lib/digitalstage/useAuth";


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
    const [mainNav, setMainNav] = useState<MainNavItem[]>([]);
    const [userNav, setUserNav] = useState<UserNavItem[]>([]);
    const [activeNavItem, setActiveNavItem] = useState<MainNavItem>();

    const router = useRouter();
    const {stageId, stages, user, devices} = useStageState();

    useEffect(() => {
        setActiveNavItem(mainNav.find(nav => nav.item.path === router.pathname));
    }, [router.pathname])

    useEffect(() => {
        if (user) {
            const nav: MainNavItem[] = [];
            if (stageId) {
                nav.push({
                    icon: () => <img src="crop_landscape-24px.svg"/>,
                    item: {
                        label: stages.byId[stageId].name,
                        path: '/'
                    },
                    mapItemToNode: renderItem,
                    mapItemToString: renderItem,
                });
                nav.push({
                    icon: () => <Delete/>,
                    item: {
                        label: stages.byId[stageId].name + " verlassen",
                        path: '/leave'
                    },
                    mapItemToNode: renderItem,
                    mapItemToString: renderItem,
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

    return (
        <Layer>
            <div className={containerStyles}>
                <AppNavBar
                    appDisplayName={<TextLink hideUnderline={true} href={"/"}>Digital Stage</TextLink>}
                    mainNav={mainNav}
                    isNavItemActive={({item}: any) => {
                        return (item.item.path && router.pathname === item.item.path) || isActive(mainNav, item, activeNavItem);
                    }}
                    onNavItemSelect={({item}: any) => {
                        if (item === activeNavItem) return;
                        setActiveNavItem(item);
                        if (item.item.path) {
                            router.push(item.item.path);
                        }
                    }}
                    userNav={userNav}
                    username={user && user.name}
                    usernameSubtitle={authUser && authUser.email}
                    userImgUrl={user && user.avatarUrl}
                />
            </div>
        </Layer>
    );
};
export default AppNavigation;