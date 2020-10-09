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
import {useStages, useStageSelector} from "../../lib/digitalstage/useStages";
import {useDevices} from "../../lib/digitalstage/useDevices";
import TextLink from "../theme/TextLink";


const AppNavigation = () => {
    const [css] = useStyletron();
    const containerStyles = css({
        boxSizing: 'border-box',
        width: '100vw',
        position: 'fixed',
        top: '0',
        left: '0',
    });
    const [mainNav, setMainNav] = useState<MainNavItem[]>([]);
    const [userNav, setUserNav] = useState<UserNavItem[]>([]);
    const [activeNavItem, setActiveNavItem] = useState<MainNavItem>();

    const router = useRouter();
    const {current, stage} = useStageSelector((state) => {
        return {
            current: state.current,
            stage: state.current ? state.stages.byId[state.current.stageId] : undefined
        };
    });
    const {user, remoteDevices} = useDevices();

    useEffect(() => {
        setActiveNavItem(mainNav.find(nav => nav.item.path === router.pathname));
    }, [router.pathname])

    useEffect(() => {
        if (user) {
            const nav: MainNavItem[] = [];
            if (current) {
                nav.push({
                    icon: () => <img src="crop_landscape-24px.svg"/>,
                    item: {
                        label: stage.name,
                        path: '/'
                    },
                    mapItemToNode: renderItem,
                    mapItemToString: renderItem,
                });
            }
            nav.push(SHOW_ALL_STAGES);
            if (remoteDevices.length > 0) {
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
    }, [user, current, stage, remoteDevices])

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
                    usernameSubtitle={user && user.name}
                    userImgUrl={user && user.avatarUrl}
                />
            </div>
        </Layer>
    );
};
export default AppNavigation;