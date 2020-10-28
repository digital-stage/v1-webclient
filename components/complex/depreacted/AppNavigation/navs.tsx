import {
    ChevronDown,
    Delete,
    Overflow as UserIcon,
    Upload as Icon,
} from 'baseui/icon';
import {NavItemT, POSITION} from "baseui/app-nav-bar";

export interface Item {
    label: string;
    path?: string;
}

export const SHOW_ALL_STAGES: NavItemT = {
    icon: () => <img src="filter_none-24px.svg"/>,
    label: 'Meine Bühnen',
    info: {
        path: '/stages'
    }
}

export const SHOW_LOCAL_DEVICE_ONLY: NavItemT = {
    icon: Icon,
    label: 'Einstellungen',
    info: {
        path: '/devices'
    }
}
export const SHOW_LOCAL_AND_REMOTE_DEVICES: NavItemT = {
    icon: ChevronDown,
    label: 'Einstellungen',
    navExitIcon: Delete,
    navPosition: {desktop: POSITION.horizontal},
    children: [
        {
            icon: Icon,
            label: 'Dieses Gerät',
            info: {
                path: '/devices/local'
            }
        },
        {
            icon: Icon,
            label: 'Andere Geräte',
            info: {
                path: '/devices/remote'
            }
        }
    ]
}

export const USER_NAV: NavItemT[] = [
    {
        icon: UserIcon,
        label: 'Profil',
        info: {
            path: '/account/profile'
        },
    },
    {
        icon: UserIcon,
        label: 'Abmelden',
        info: {
            path: '/account/logout'
        },
    }
];

export const NO_USER_NAV: NavItemT[] = [
    {
        icon: Icon,
        label: 'Registrieren',
        info: {
            path: '/account/signup'
        }
    },
    {
        icon: Icon,
        label: 'Anmelden',
        info: {
            path: '/account/login'
        }
    },
]