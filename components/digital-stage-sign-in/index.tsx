import React, { useState } from "react";
import { createStyles, Grid, Slide, makeStyles, Theme, Typography } from "@material-ui/core";

import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgetPasswordForm from "./ForgetPasswordForm";
import FormContainerView from "./FormContainerView";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: "transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box;",
            minHeight: "100vh",
            color: theme.palette.common.white,
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4)
        },
        controller: {
            padding: "10px 20px",
            cursor: "pointer",
            borderBottom: "2px solid transparent"
        },
        selectedController: {
            transition: "border 1s ease-out",
            borderBottom: `2px solid ${theme.palette.primary.main}`
        },
        text: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        forgetPassword: {
            textAlign: "center",
            cursor: "pointer"
        }
    }),
);

const Login = (props: {
    mode: "signup" | "login" | "forget"
}) => {
    const classes = useStyles();
    const [LoginOpen, setLoginOpen] = useState(props.mode === "login");
    const [SignupOpen, setSignupOpen] = useState(props.mode === "signup");
    const [ForgetOpen, setForgetOpen] = useState(props.mode === "forget");

    const showLoginBox = () => {
        setLoginOpen(true);
        setForgetOpen(false);
        setSignupOpen(false);
    };

    const showRegisterBox = () => {
        setSignupOpen(true);
        setForgetOpen(false);
        setLoginOpen(false);
    };

    const showForgetBox = () => {
        setForgetOpen(true);
        setLoginOpen(false);
    };

    return (
        <div className={classes.root}>
            <Grid container={true} direction='column' alignContent="center" alignItems="center">
                <img
                    src="/images/welcome_icon.png"
                    width="180"
                    height="auto"
                    alt="logo"
                />
            </Grid>
            <FormContainerView>
                <Grid
                    container={true}
                    direction="row"
                    alignContent="center"
                    alignItems="center"
                    justify='space-evenly'
                    className={classes.text}
                >
                    <Typography
                        variant="h5"
                        onClick={showLoginBox}
                        className={`${classes.controller} ${(LoginOpen || ForgetOpen) && classes.selectedController}`}
                    >
                        Sign in
                    </Typography>
                    <Typography
                        variant="h5"
                        onClick={showRegisterBox}
                        className={`${classes.controller} ${SignupOpen && classes.selectedController}`}
                    >
                        Sign up
                    </Typography>
                </Grid>
                {LoginOpen && <SignInForm />}
                {SignupOpen && <SignUpForm />}
                {ForgetOpen && <ForgetPasswordForm onClick={showLoginBox} />}
                {LoginOpen && <Typography
                    variant="h6"
                    onClick={showForgetBox}
                    className={classes.forgetPassword}
                >
                    Forgot password?
                    </Typography>
                }
            </FormContainerView>
        </div>
    );
};

export default Login;
