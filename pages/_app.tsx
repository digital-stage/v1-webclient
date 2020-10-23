import {AppProps} from 'next/app'
import {Provider as StyletronProvider} from 'styletron-react'
import {debug, styletron} from '../styletron'
import {AuthContextProvider} from "../lib/digitalstage/useAuth";
import {BaseProvider, DarkTheme, LightTheme} from "baseui";
import React, {FC} from "react";
import {SocketContextProvider} from "../lib/digitalstage/useStageContext";
import {RequestContextProvider} from "../lib/useRequest";
import Head from 'next/head'
import StageJoiner from "../components/layouts/StageJoiner";
import LocalDeviceControl from '../components/complex/depreacted/devices/LocalDeviceControl';
import {AudioContextProvider} from "../lib/useAudioContext";
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import MediasoupProvider from "../lib/digitalstage/useMediasoup";
import {wrapper} from "../lib/digitalstage/useStageContext/redux";
import {DarkModeConsumer, DarkModeProvider} from "../lib/useDarkModeSwitch";
import AudioContextController from "../components/complex/depreacted/audio/AudioContextController";
import StageWebAudioProvider from "../lib/useStageWebAudio";
import MainWrapper from "../components/layouts/PageWrapper";
import {DSDarkTheme, DSLightTheme} from "../components/DSTheme";

const MyApp: FC<AppProps> = ({Component, pageProps}) => {
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
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>
            <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
                <RequestContextProvider>
                    <AuthContextProvider>
                        <SocketContextProvider>
                            <MediasoupProvider>
                                <AudioContextProvider>
                                    <DarkModeProvider>
                                        <DarkModeConsumer>
                                            {(darkMode) => (
                                                <ThemeProvider theme={darkMode ? DSDarkTheme : DSLightTheme}>
                                                    <CssBaseline/>
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

                                                        <StageWebAudioProvider>
                                                            <MainWrapper>
                                                                <Component {...pageProps} />
                                                            </MainWrapper>
                                                        </StageWebAudioProvider>
                                                        <AudioContextController/>

                                                        <StageJoiner/>

                                                        <LocalDeviceControl/>
                                                    </BaseProvider>
                                                </ThemeProvider>
                                            )}
                                        </DarkModeConsumer>
                                    </DarkModeProvider>
                                </AudioContextProvider>
                            </MediasoupProvider>
                        </SocketContextProvider>
                    </AuthContextProvider>
                </RequestContextProvider>
            </StyletronProvider>
        </>
    )
}
export default wrapper.withRedux(MyApp);