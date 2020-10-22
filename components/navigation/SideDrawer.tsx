import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Drawer} from '@material-ui/core';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Icon from '../base/Icon';
import Link from 'next/link';
// import StagesList from './StagesList';
// import StageDetails from './StageDetails';

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

enum SelectedItem {
    MENU = "MENU",
    STAGE = "STAGE",
    SETTINGS = "SETTINGS",
    NOTIFICATION = "NOTIFICATION"
}

interface User {
    userPhoto: string,
    username: string
}

export interface Stage {
    title: string,
    mineStage: boolean,
    image: string,
    online: boolean,
    description: string,
    users: User[]
}

const stages: Stage[] = [
    {
        title: 'Bulshemier Theatre',
        mineStage: true,
        image: "/images/stage-icon.png",
        online: true,
        users: [{userPhoto: "/images/stage-icon.png", username: "username"}],
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, corporis."
    },
    {
        title: 'National Theatre',
        mineStage: false,
        image: "/images/stage-icon.png",
        online: true,
        users: [{userPhoto: "/images/stage-icon.png", username: "username"}, {
            userPhoto: "/images/stage-icon.png",
            username: "username"
        }, {userPhoto: "/images/stage-icon.png", username: "username"}],
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, corporis."
    },
    {
        title: 'Theatre National Royal',
        mineStage: true,
        image: "/images/stage-icon.png",
        online: false,
        users: [{userPhoto: "/images/stage-icon.png", username: "username"}, {
            userPhoto: "/images/stage-icon.png",
            username: "username"
        }, {userPhoto: "/images/stage-icon.png", username: "username"}, {
            userPhoto: "/images/stage-icon.png",
            username: "username"
        }, {userPhoto: "/images/stage-icon.png", username: "username"}, {
            userPhoto: "/images/stage-icon.png",
            username: "username"
        }],
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, corporis."
    },
    {
        title: 'The Old Theatre',
        mineStage: false,
        image: "/images/stage-icon.png",
        online: false,
        users: [{userPhoto: "/images/stage-icon.png", username: "username"}, {
            userPhoto: "/images/stage-icon.png",
            username: "username"
        }, {userPhoto: "/images/stage-icon.png", username: "username"}],
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, corporis."
    },
    {
        title: 'Lyceum Theatre',
        mineStage: true,
        image: "/images/stage-icon.png",
        online: true,
        users: [{userPhoto: "/images/stage-icon.png", username: "username"}, {
            userPhoto: "/images/stage-icon.png",
            username: "username"
        }, {userPhoto: "/images/stage-icon.png", username: "username"}, {
            userPhoto: "/images/stage-icon.png",
            username: "username"
        }, {userPhoto: "/images/stage-icon.png", username: "username"}, {
            userPhoto: "/images/stage-icon.png",
            username: "username"
        }, {userPhoto: "/images/stage-icon.png", username: "username"}, {
            userPhoto: "/images/stage-icon.png",
            username: "username"
        }, {userPhoto: "/images/stage-icon.png", username: "username"}],
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, corporis."
    },
];

export default function SideDrawer(props: {
    className?: string;
}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [stageId, setStageId] = React.useState(0);
    const [selectedItem, setSelectedItem] = React.useState<string>(SelectedItem.STAGE);

    const handleDrawer = (icon: string) => {
        if (icon === "menu") {
            setOpen(!open);
        }
    };

    const setDrawerSelection = (selection: string) => {
        if (selection === SelectedItem.MENU) {
            setSelectedItem(selectedItem);
        } else {
            setSelectedItem(selection);
        }
    };

    const setDrawerIconColor = (selected: string) => {
        let color = "#828282";
        if (selected === SelectedItem.MENU) {
            color = "#fff"
        }
        if (selected === selectedItem) {
            color = "#fff"
        }
        return color
    }

    const menuItems = [
        {icon: "stage", link: "/stages"},
        {icon: "notification", link: "/devices"},
    ]

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
                        {['menu'].map((text) => (
                            <ListItem button key={text} onClick={() => {
                                handleDrawer(text)
                            }}>
                                <Icon name={text}/>
                            </ListItem>
                        ))}
                        {menuItems.map((item) => (
                            <ListItem button key={item.icon} onClick={() => {
                                handleDrawer(item.icon)
                            }}>
                                <Link href={item.link}><Icon name={item.icon}/></Link>
                            </ListItem>
                        ))}
                    </List>
                    <List>
                        {['feedback', 'settings'].map((text) => (
                            <ListItem button key={text}>
                                <Icon name={text} iconColor={setDrawerIconColor(text.toUpperCase())}/>
                            </ListItem>
                        ))}
                    </List>
                </span>
            </div>
        </Drawer>
    );
}
