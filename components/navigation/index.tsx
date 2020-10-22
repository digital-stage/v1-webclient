import React from "react";
import SideDrawer from "./SideDrawer";
import {makeStyles} from "@material-ui/core/styles";
import MobileMenu from "./MobileMenu";


const useStyles = makeStyles((theme) => ({
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
    }
}));


const Navigation = () => {
    const classes = useStyles();

    return (
        <>
            <SideDrawer className={classes.showDesktop}/>
            <MobileMenu className={classes.showMobile}/>
        </>
    )

};

export default Navigation;