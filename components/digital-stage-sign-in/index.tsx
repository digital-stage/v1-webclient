import React, {useState} from "react";
import {Box, createStyles, Grid, Icon, IconButton, Link, makeStyles, Theme, Typography} from "@material-ui/core";

import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import {loadCSS} from "fg-loadcss";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: "transparent linear-gradient(180deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box",
            minHeight: "100vh",
            color: theme.palette.common.white,
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        container: {
            background: "#000000bf",
            width: "300px",
            borderRadius: "5px",
            boxShadow: "0px 3px 50px rgba(11, 33, 64, 0.75) ",
            padding: "15px 10px"
        },
        controller: {
            padding: "10px 30px",
            cursor: "pointer",
            borderBottom: "2px solid transparent"
        },
        selectedController: {
            transition: "border 0.5s ease-out",
            borderBottom: `2px solid ${theme.palette.primary.main}`
        },
        text: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        center: {
            textAlign: "center"
        },
        iconButton: {
            backgroundColor: "#897FE4",
            width: "36px",
            height: "36px",
            borderRadius: "20px",
        },
        icon: {
            color: "#fff",
            fontSize: "20px",
            marginTop: "8px"
        }
    }),
);

const Login = (props: {
    mode: "signup" | "login"
}) => {
    const classes = useStyles();
    const [LoginOpen, setLoginOpen] = useState(props.mode === "login");
    const [SignupOpen, setSignupOpen] = useState(props.mode === "signup");

    /*
    React.useEffect(() => {
        /*const node = loadCSS(
            "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
            document.querySelector("#font-awesome-css")
        );

        return () => {
            node.parentNode.removeChild(node);
        };
    }, []);*/

    const showLoginBox = () => {
        setLoginOpen(true);
        setSignupOpen(false);
    };

    const showRegisterBox = () => {
        setSignupOpen(true);
        setLoginOpen(false);
    };

    return (
        <Grid
            container={true}
            direction="column"
            alignItems="center"
            alignContent="center"
            justify='space-between'
            className={classes.root}
        >
            <Grid container={true} direction='column' alignContent="center" alignItems="center">
                <img
                    src="images/welcome_icon.png"
                    width="120"
                    height="auto"
                    alt="logo"
                />
                <Typography variant="h3" className={classes.text}>Welcome</Typography>
            </Grid>
            <Box className={classes.container}>
                <Grid
                    container={true}
                    direction="row"
                    alignContent="center"
                    alignItems="center"
                    justify='space-evenly'
                >
                    <Typography
                        variant="h5"
                        onClick={showLoginBox}
                        className={`${classes.controller} ${LoginOpen && classes.selectedController}`}
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
                {LoginOpen && <SignInForm/>}
                {SignupOpen && <SignUpForm/>}
                <Grid className={classes.center}>
                    <Link>
                        <IconButton disabled={true}>
                            <span className={classes.iconButton}
                            >
                                <Icon
                                    className={`fab fa-facebook-f ${classes.icon}`}
                                />
                            </span>
                        </IconButton>
                    </Link>
                    <Link>
                        <IconButton>
                            <span className={classes.iconButton}>
                                <Icon
                                    className={`fab fa-google ${classes.icon}`}
                                />
                            </span>
                        </IconButton>
                    </Link>
                    <Link>
                        <IconButton>
                            <span className={classes.iconButton}>
                                <Icon
                                    className={`fab fa-microsoft ${classes.icon}`}
                                />
                            </span>
                        </IconButton>
                    </Link>
                </Grid>

            </Box>
            <Box>
                <Typography variant="h6" className={classes.text}>Enter stage ID to join as Guest</Typography>
            </Box>
        </Grid>
    );
};

export default Login;
