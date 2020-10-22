import { AppProps } from 'next/app'
import { Provider as StyletronProvider } from 'styletron-react'
import { debug, styletron } from '../styletron'
import { AuthContextProvider } from "../lib/digitalstage/useAuth";
import { BaseProvider, DarkTheme, LightTheme, styled } from "baseui";
import React, { FC } from "react";
import { SocketContextProvider } from "../lib/digitalstage/useStageContext";
import { RequestContextProvider } from "../lib/useRequest";
import Head from 'next/head'
import StageJoiner from "../components/complex/depreacted/stage/StageJoiner";
import { Block } from 'baseui/block';
import LocalDeviceControl from '../components/complex/depreacted/devices/LocalDeviceControl';
import { AudioContextProvider } from "../lib/useAudioContext";
import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import theme from "../styles/theme";
import MediasoupProvider from "../lib/digitalstage/useMediasoup";
import Link from "next/link";
import AppNavigation from "../components/complex/depreacted/AppNavigation";
import { wrapper } from "../lib/digitalstage/useStageContext/redux";
import { DarkModeConsumer, DarkModeProvider } from "../lib/useDarkModeSwitch";
import AudioContextController from "../components/complex/depreacted/audio/AudioContextController";
import AllAudioPlayer from "../components/complex/depreacted/audio/AllAudioPlayer";
import Drawer from '../components/navigation';


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

const DevCorner = styled("div", {
    position: "fixed",
    top: "1rem",
    right: ".5rem",
    zIndex: 9999
});
const DevButton = styled("a", {
    color: "black",
    backgroundColor: "white",
    border: "1px solid black",
    padding: ".5rem",
    cursor: "pointer",
    ":hover": {
        color: "white",
        backgroundColor: "black",
    }
});

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
    //const store = useStore(pageProps.initialReduxState)
    const classes = useStyles();

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
                    <RequestContextProvider>
                        <AuthContextProvider>
                            <SocketContextProvider>
                                <MediasoupProvider>
                                    <AudioContextProvider>
                                        <DarkModeProvider>
                                            <DarkModeConsumer>
                                                {(darkMode) => (
                                                    <BaseProvider theme={darkMode ? DarkTheme : LightTheme}>
                                                        <style jsx global>{`
                                            @import("https://use.fontawesome.com/releases/v5.12.0/css/all.css");
                                            * {
                                                box-sizing: border-box;
                                            }
                                            html, body {
                                                margin: 0;
                                                padding: 0;
                                                width: 100%;
                                            }
                                            body {
                                                font-family: var(--font-sans);
                                                color: ${darkMode ? "#ffffff" : "#000000"};
                                                background-color: ${darkMode ? "#000000" : "#ffffff"};
                                                transition-timing-function: cubic-bezier(0, 0, 1, 1);
                                                transition: color 200ms, background-color 200ms;
                                                overflow-x: hidden;
                                                overflow-y: scroll;
                                            }
                                            @keyframes bounce {
                                                0%   { transform: translateY(0); }
                                                50%  { transform: translateY(-20px); }
                                                100% { transform: translateY(0); }
                                            }
                                        `}
                                                        </style>

                                                        <AppNavigation />
                                                        <StageJoiner />
                                                        <div className={classes.root}>
                                                            <Drawer />
                                                            <main className={classes.content}>
                                                                <Block
                                                                marginTop={['52px', '52px', '72px']}
                                                                >
                                                                    <Component {...pageProps} />
                                                                    <AllAudioPlayer />
                                                                    <AudioContextController />
                                                                </Block>
                                                            </main>
                                                        </div>
                                                        {/* </Drawer> */}
                                                        <LocalDeviceControl />
                                                        {process.env.NODE_ENV === "development" && (
                                                            <DevCorner>
                                                                <Link href="/debug">
                                                                    <DevButton>
                                                                        DEV
                                                                    </DevButton>
                                                                </Link>
                                                            </DevCorner>
                                                        )}
                                                        <LocalDeviceControl />
                                                    </BaseProvider>
                                                )}
                                            </DarkModeConsumer>
                                        </DarkModeProvider>
                                    </AudioContextProvider>
                                </MediasoupProvider>
                            </SocketContextProvider>
                        </AuthContextProvider>
                    </RequestContextProvider>
                </StyletronProvider>
            </ThemeProvider>
        </>
    )
}
export default wrapper.withRedux(MyApp);