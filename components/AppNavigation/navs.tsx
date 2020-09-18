import {
    ChevronDown,
    Delete,
    Overflow as UserIcon,
    Upload as Icon,
} from 'baseui/icon';
import {renderItem} from "./util";
import {MainNavItemT, POSITION, UserNavItemT} from "baseui/app-nav-bar";

export interface Item {
    label: string;
    path?: string;
}

export interface MainNavItem extends MainNavItemT {
    item: Item,
    navPosition?: any
}
export interface UserNavItem extends UserNavItemT {
    item: Item
}

export const SHOW_ALL_STAGES: MainNavItem = {
    icon: () => <img src="filter_none-24px.svg"/>,
    item: {
        label: 'Meine Bühnen',
        path: '/stages'
    },
    mapItemToNode: renderItem,
    mapItemToString: renderItem,
}

export const SHOW_LOCAL_DEVICE_ONLY: MainNavItem = {
    icon: Icon,
    item: {
        label: 'Einstellungen',
        path: '/devices'
    },
    mapItemToNode: renderItem,
    mapItemToString: renderItem,
}
export const SHOW_LOCAL_AND_REMOTE_DEVICES: MainNavItem = {
    icon: ChevronDown,
    item: {
        label: 'Einstellungen'
    },
    mapItemToNode: renderItem,
    mapItemToString: renderItem,
    navExitIcon: Delete,
    navPosition: {desktop: POSITION.horizontal},
    nav: [
        {
            icon: Icon,
            item: {label: 'Dieses Gerät'},
            mapItemToNode: renderItem,
            mapItemToString: renderItem,
        },
        {
            icon: Icon,
            item: {label: 'Andere Geräte'},
            mapItemToNode: renderItem,
            mapItemToString: renderItem,
        }
    ]
}

export const USER_NAV: UserNavItem[] = [
    {
        icon: UserIcon,
        item: {
            label: 'Profil',
            path: '/profile'
        },
        mapItemToNode: renderItem,
        mapItemToString: renderItem,
    },
    {
        icon: UserIcon,
        item: {
            label: 'Abmelden',
            path: '/logout'
        },
        mapItemToNode: renderItem,
        mapItemToString: renderItem,
    }
];

export const NO_USER_NAV: UserNavItem[] = [
    {
        icon: Icon,
        item: {
            label: 'Registrieren',
            path: '/signup'
        },
        mapItemToNode: renderItem,
        mapItemToString: renderItem,
    },
    {
        icon: Icon,
        item: {
            label: 'Anmelden',
            path: '/login'
        },
        mapItemToNode: renderItem,
        mapItemToString: renderItem,
    },
]