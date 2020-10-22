import {makeStyles} from "@material-ui/core/styles";
import {useAuth} from "../../../lib/digitalstage/useAuth";
import Drawer from "../../navigation";
import React from "react";
import {Block} from "baseui/block";
import SideDrawer from "../../navigation/SideDrawer";
import MobileMenu from "../../navigation/MobileMenu";


const drawerWidth = 380;

const useStyles = makeStyles((theme) => ({
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
    },
    showDesktop: {
        display: "none",
        [theme.breakpoints.up('md')]: {
            display: "flex"
        }
    },
    showMobile: {
        width: "100%",
        display: "flex",
        [theme.breakpoints.up('md')]: {
            display: "none",
        }
    },

    root: {
        flexGrow: 1,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.up('md')]: {
            display: "flex",
            flexDirection: "row",
        }
    },
    content: {
        position: "relative",
        display: "flex",
        flexGrow: 1,
        width: "100%",
        textAlign: "center",
        overflowY: "auto",

        padding: theme.spacing(3),

        background: "transparent linear-gradient(180deg, #575757 0%, #303030 30%, #282828 100%) 0% 0% no-repeat padding-box",

        [theme.breakpoints.up('md')]: {
            width: "auto",
            display: "inline-block",
        }
    },
}));

const MainWrapper = (props: {
    children: React.ReactNode
}) => {
    const {user} = useAuth();
    const classes = useStyles();

    //TODO: Stage behavior -> without wrapped div, the classes.root is not rendered ...
    return (
        <div>
            <div className={classes.root}>
                {user ? <>
                    <SideDrawer className={classes.showDesktop}/>
                    <MobileMenu className={classes.showMobile}/>
                </> : null}
                <main className={classes.content}>
                    {props.children}
                </main>
            </div>
        </div>
    )
};
export default MainWrapper;