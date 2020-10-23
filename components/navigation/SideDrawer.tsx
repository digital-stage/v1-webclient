import React, {useCallback, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Drawer} from '@material-ui/core';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Icon from '../base/Icon';
import Link from 'next/link';
import useMenus, {NavItem} from "./useMenus";
import {useRouter} from "next/router";

const drawerWidth = 380;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100vw",
        height: "100vh",
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'normal'
    },
    drawerOpen: {
        width: drawerWidth,
        background: "#272727 0% 0% no-repeat padding-box",
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflow: "hidden !important",
        borderRight: "0"
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        background: "#272727 0% 0% no-repeat padding-box",
        // width: theme.spacing(7) + 1,
        width: "55px",
        [theme.breakpoints.up('sm')]: {
            // width: theme.spacing(9) + 1,
            width: "55px",
        },
        overflow: "hidden !important",
        borderRight: "0"
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        background: "transparent linear-gradient(180deg, #575757 0%, #303030 30%, #282828 100%) 0% 0% no-repeat padding-box",
        display: "inline-block",
        width: "380px",
        maxHeight: "100vh",
        overflowY: "auto",
        textAlign: "center",
    },
    sideDrawer: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        maxHeight: "100vh",
        background: "#343434 0% 0% no-repeat padding-box",
        boxShadow: "20px 0px 60px #0000004A",
    },
    leftSide: {
        display: 'flex',
        flexDirection: "row",
        minHeight: "100vh"
    },
    drawerContent: {
        width: "100%"
    }
}));

export default function SideDrawer(props: {
    className?: string;
}) {
    const router = useRouter();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const menus = useMenus();

    const handleDrawer = (icon: string) => {
        if (icon === "menu") {
            setOpen(!open);
        }
    };
    const [selectedItem, setSelectedItem] = React.useState<NavItem>(undefined);

    useEffect(() => {
        if (menus.ready) {
            // Find item by path
            const item = menus.findItemByPath(router.pathname);
            if (item)
                setSelectedItem(item);
        }
    }, [router.pathname, menus.ready])

    const renderItem = useCallback((item: NavItem): React.ReactElement => {
        const isSelected: boolean = selectedItem && item.label && item.label === selectedItem.label;
        const color: string = isSelected ? "#fff" : "#828282";

        const icon = item.path ? (
            <Link href={item.path}>
                {item.icon}
            </Link>
        ) : item.icon;

        return (
            <ListItem
                button
                selected={isSelected}
                onClick={() => setSelectedItem(item)}>
                {icon}
            </ListItem>
        );
    }, [selectedItem])

    return (
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            }, props.className)}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
        >
            <div className={classes.leftSide}>
                <span className={classes.sideDrawer}>
                    <List>
                        <ListItem button onClick={() => setOpen(prev => !prev)}>
                            <Icon name="menu"/>
                        </ListItem>

                        {menus.stageNav.map(navItem => renderItem(navItem))}
                    </List>
                    <List>
                        {menus.settingsNav.map(navItem => renderItem(navItem))}
                    </List>
                </span>
            </div>
        </Drawer>
    );
}
