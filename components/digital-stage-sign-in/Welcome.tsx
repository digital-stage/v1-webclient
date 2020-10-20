import React from "react";
import { Box, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import Button from "../base/Button";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: "transparent linear-gradient(180deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box",
            height: "100vh",
            color: theme.palette.common.white,
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        text: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        center: {
            textAlign: "center"
        }
    }),
);

const Welcome = () => {
    const classes = useStyles();

    return (
        <Box>
            <Grid
                container={true}
                direction='column'
                alignContent="center"
                alignItems="center"
                justify='space-between'
                className={classes.root}
            >
                <Grid container={true} direction='column' alignContent="center" alignItems="center">
                    <img
                        src="/images/white_logo.png"
                        width="80"
                        height="auto"
                        alt="logo"
                    />
                    <Typography variant="h4" className={classes.text}>
                        Your digital stage for art, music <br /> and theatre ensembles.
                </Typography>
                </Grid>
                <Grid container={true} direction='column' alignContent="center" alignItems="center">
                    <Typography variant="h3" className={classes.text}>Welcome back</Typography>
                    <Button
                        color="light"
                        text="Sign in"
                    />
                    <Typography variant="h6" className={`${classes.text} ${classes.center}`}>Sign into account or <br /> create a new one</Typography>
                </Grid>
                <Typography variant="h6" className={classes.text}>Version 0.00001</Typography>
            </Grid>
        </Box>
    );
};
export default Welcome;
