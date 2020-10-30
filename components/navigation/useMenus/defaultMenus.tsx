import {Delete, Overflow} from "baseui/icon";
import {NavItem} from "./index";
import Icon2 from "../../base/Icon2";

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
        icon: <Icon2 name="stage"/>,
        path: "/stages"
    },
    // {
    //     label: "Ereignisse",
    //     icon: <Icon2 name="notification"/>
    // },
];

export const DefaultSettingsMenu: NavItem[] = [
    {
        label: "Problem melden",
        icon: <Icon2 name="feedback"/>,
    },
    {
        label: "Meine Geräte",
        icon: <Icon2 name="settings"/>,
        path: "/devices"
    },
];