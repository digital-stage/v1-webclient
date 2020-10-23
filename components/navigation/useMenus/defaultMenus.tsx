import {Delete, Overflow} from "baseui/icon";
import Icon from "../../base/Icon";
import {NavItem} from "./index";

export const DefaultUserSignedOutMenu: NavItem[] = [
    {
        label: "Anmelden",
        icon: <Overflow/>,
        path: "/account/login"
    },
    {
        label: "Registrieren",
        icon: <Delete/>,
        path: "/account/signup"
    },
];
export const DefaultUserSignedInMenu: NavItem[] = [
    {
        label: "Mein Profil",
        icon: <Overflow/>,
        path: "/account/profile"
    },
    {
        label: "Abmelden",
        icon: <Delete/>,
        path: "/account/logout"
    },
];

export const DefaultStageMenu: NavItem[] = [
    {
        label: "Meine Bühnen",
        icon: <Icon name="stage"/>,
        path: "/stages"
    },
    {
        label: "Ereignisse",
        icon: <Icon name="notification"/>
    },
];

export const DefaultSettingsMenu: NavItem[] = [
    {
        label: "Problem melden",
        icon: <Icon name="feedback"/>,
    },
    {
        label: "Meine Geräte",
        icon: <Icon name="settings"/>,
        path: "/devices"
    },
];