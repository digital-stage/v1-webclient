import App from 'next/app'
import {Provider as StyletronProvider} from 'styletron-react'
import {debug, styletron} from '../styletron'
import {AuthContextProvider} from "../lib/digitalstage/useAuth";
import {BaseProvider, DarkTheme, LightTheme} from "baseui";
import React from "react";
import {StagesContextProvider, StageStateConsumer} from "../lib/digitalstage/useStageContext";
import {RequestContextProvider} from "../lib/useRequest";
import Head from 'next/head'
import AppNavigation from "../components/AppNavigation";
import StageJoiner from "../components/stage/StageJoiner";
import {Block} from 'baseui/block';
import LocalDeviceControl from '../components/devices/LocalDeviceControl';
import {AudioContextProvider} from "../lib/useAudioContext";
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import theme from "../styles/theme";
import MediasoupProvider from "../lib/digitalstage/useMediasoup";

class MyApp extends App {
    render() {
        const {Component, pageProps} = this.props;

        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                </Head>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
                        <RequestContextProvider>
                            <AuthContextProvider>
                                <StagesContextProvider>
                                    <MediasoupProvider>
                                        <AudioContextProvider>
                                            <StageStateConsumer>
                                                {(state) => (
                                                    <BaseProvider theme={state.current ? DarkTheme : LightTheme}>
                                                        <style jsx global>{`
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
                                                color: ${state.current ? "#ffffff" : "#000000"};
                                                background-color: ${state.current ? "#000000" : "#ffffff"};
                                                transition-timing-function: cubic-bezier(0, 0, 1, 1);
                                                transition: color 200ms, background-color 200ms;
                                                overflow-x: hidden;
                                            }
                                            @keyframes bounce {
                                                0%   { transform: translateY(0); }
                                                50%  { transform: translateY(-20px); }
                                                100% { transform: translateY(0); }
                                            }
                                        `}
                                                        </style>
                                                        <AppNavigation/>
                                                        <StageJoiner/>
                                                        <Block marginTop={['52px', '52px', '72px']}>
                                                            <Component {...pageProps} />
                                                        </Block>
                                                        <LocalDeviceControl/>
                                                    </BaseProvider>
                                                )}
                                            </StageStateConsumer>
                                        </AudioContextProvider>
                                    </MediasoupProvider>
                                </StagesContextProvider>
                            </AuthContextProvider>
                        </RequestContextProvider>
                    </StyletronProvider>
                </ThemeProvider>
            </>
        )
    }
}

export default MyApp;