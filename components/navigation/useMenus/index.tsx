import {useAuth} from "../../../lib/digitalstage/useAuth";
import useStageSelector from "../../../lib/digitalstage/useStageSelector";
import {Stage} from "../../../lib/digitalstage/common/model.server";
import React, {useCallback, useEffect, useState} from "react";
import {DefaultSettingsMenu, DefaultStageMenu, DefaultUserSignedInMenu, DefaultUserSignedOutMenu} from "./defaultMenus";

export interface NavItem {
    // LABEL HAS TO BE UNIQUE (!)
    label: string;
    icon: React.ReactElement;

    // Link
    path?: string;

    // Element for a sidebar, avoid using path and children at the same time
    children?: React.ComponentType<any>;
}


const useMenus = (): {
    mainNav: NavItem[];
    userNav: NavItem[];
    settingsNav: NavItem[];
    stageNav: NavItem[];
    ready: boolean;
    findItemByPath: (path: string) => NavItem
} => {
    const {user, loading} = useAuth();
    const stageReady = useStageSelector<boolean>(state => state.ready);
    const stage = useStageSelector<Stage>(state => state.stageId ? state.stages.byId[state.stageId] : undefined);
    const [mainNav, setMainNav] = useState<NavItem[]>([]);
    const [stageNav, setStageNav] = useState<NavItem[]>([]);
    const [settingsNav, setSettingsNav] = useState<NavItem[]>([]);
    const [userNav, setUserNav] = useState<NavItem[]>(DefaultUserSignedOutMenu);
    const [ready, setReady] = useState<boolean>();

    useEffect(() => {
        if (!loading && stageReady) {
            setReady(true);
        }
    }, [stageReady, loading])

    useEffect(() => {
        if (stage) {
            setStageNav(DefaultStageMenu)
        } else {
            setStageNav([]);
        }
    }, [stage]);

    useEffect(() => {
        if (user) {
            setUserNav(DefaultUserSignedInMenu);
            setSettingsNav(DefaultSettingsMenu);
        } else {
            setUserNav(DefaultUserSignedOutMenu);
            setSettingsNav([]);
        }
    }, [user]);

    const findItemByPath = useCallback((path: string): NavItem => {
        let item = mainNav.find(item => item.path === path)
        if (!item)
            item = stageNav.find(item => item.path === path)
        if (!item)
            item = settingsNav.find(item => item.path === path)
        if (!item)
            userNav.find(item => item.path === path)
        return item;
    }, [mainNav, stageNav, settingsNav, userNav])

    return {
        mainNav: mainNav,
        stageNav: stageNav,
        settingsNav: settingsNav,
        userNav: userNav,
        ready: ready,
        findItemByPath: findItemByPath
    };
}
export default useMenus;