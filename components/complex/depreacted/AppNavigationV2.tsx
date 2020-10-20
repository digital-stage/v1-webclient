import AppNav, {NavItem} from "./theme/appnav";
import TextLink from "./theme/TextLink";
import React, {useEffect, useState} from "react";
import {ChevronDown, Delete, Overflow as UserIcon, Upload as Icon} from "baseui/icon";
import {useRouter} from "next/router";
import {useAuth} from "../../../lib/digitalstage/useAuth";
import {useSelector} from "../../../lib/digitalstage/useStageContext/redux";
import {Devices, NormalizedState, Stages} from "../../../lib/digitalstage/useStageContext/schema";
import {LocalUser} from "../../../lib/digitalstage/useStageContext/model";

export const SHOW_ALL_STAGES: NavItem = {
    icon: () => <img src="filter_none-24px.svg"/>,
    label: 'Meine Bühnen',
    path: '/stages'
}

export const SHOW_LOCAL_DEVICE_ONLY: NavItem = {
    icon: Icon,
    label: 'Einstellungen',
    path: '/devices'
}
export const SHOW_LOCAL_AND_REMOTE_DEVICES: NavItem = {
    icon: ChevronDown,
    label: 'Einstellungen',
    navExitIcon: Delete,
    children: [
        {
            icon: Icon,
            label: 'Dieses Gerät',
            path: '/devices/local'
        },
        {
            icon: Icon,
            label: 'Andere Geräte',
            path: '/devices/remote'
        }
    ]
}

export const USER_NAV: NavItem[] = [
    {
        icon: UserIcon,
        label: 'Profil',
        path: '/account/profile'
    },
    {
        icon: UserIcon,
        label: 'Abmelden',
        path: '/account/logout'
    }
];

export const NO_USER_NAV: NavItem[] = [
    {
        icon: Icon,
        label: 'Registrieren',
        path: '/account/signup'
    },
    {
        icon: Icon,
        label: 'Anmelden',
        path: '/account/login'
    },
]

const setItemActiveByPath = (items: NavItem[], pathname: string) => {
    return items.map(item => {
        if (item.path === pathname)
            return {
                ...item,
                active: true
            };
        return {
            ...item,
            active: false
        };
    })
}

const setItemActiveByLabel = (items: NavItem[], label: string) => {
    return items.map(item => {
        if (item.label === label)
            return {
                ...item,
                active: true
            };
        return {
            ...item,
            active: false
        };
    })
}

const AppNavigationV2 = () => {
    const router = useRouter();
    const {user: authUser} = useAuth();
    const stageId = useSelector<NormalizedState, string | undefined>(state => state.stageId);
    const stages = useSelector<NormalizedState, Stages>(state => state.stages);
    const user = useSelector<NormalizedState, LocalUser | undefined>(state => state.user);
    const devices = useSelector<NormalizedState, Devices>(state => state.devices);
    const [mainItems, setMainItems] = useState<NavItem[]>(NO_USER_NAV);
    const [userItems, setUserItems] = useState<NavItem[]>(undefined);

    useEffect(() => {
        setMainItems(prev => prev ? setItemActiveByPath(prev, router.pathname) : prev);
        setUserItems(prev => prev ? setItemActiveByPath(prev, router.pathname) : prev);
    }, [router.pathname]);

    useEffect(() => {
        if (authUser) {
            setUserItems(USER_NAV);
        } else {
            setUserItems(undefined);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            if (stageId) {
                console.log("Set main items with stage");
                setMainItems([
                    {
                        icon: () => <img src="crop_landscape-24px.svg"/>,
                        label: stages.byId[stageId].name,
                        path: '/'
                    },
                    {
                        icon: () => <Delete/>,
                        label: stages.byId[stageId].name + " verlassen",
                        path: '/leave'
                    },
                    SHOW_ALL_STAGES,
                    devices.remote.length > 0 ? SHOW_LOCAL_AND_REMOTE_DEVICES : SHOW_LOCAL_DEVICE_ONLY
                ]);
            } else {
                console.log("Set main items without stage");
                setMainItems([
                    SHOW_ALL_STAGES,
                    devices.remote.length > 0 ? SHOW_LOCAL_AND_REMOTE_DEVICES : SHOW_LOCAL_DEVICE_ONLY
                ]);
            }
        } else {
            console.log("Set main items without user and stage");
            setMainItems([]);
        }
    }, [user, stageId, stages, devices]);

    return <AppNav
        title={<TextLink hideUnderline={true} href={"/"}>Digital Stage</TextLink>}
        mainItems={mainItems}
        userItems={userItems}
        onMainItemSelect={item => {
            console.log("ITEM SELECTED");
            setMainItems(prev => setItemActiveByLabel(prev, item.label));
            if (item.path) {
                return router.push(item.path);
            }
        }}
        onUserItemSelect={item => {
            console.log("USER ITEM SELECTED");
            setUserItems(prev => setItemActiveByLabel(prev, item.label));
            if (item.path) {
                return router.push(item.path);
            }
        }}
    />;
}
export default AppNavigationV2;


