import App from 'next/app'
import {Provider as StyletronProvider} from 'styletron-react'
import {debug, styletron} from '../styletron'
import {AuthContextProvider} from "../lib/digitalstage/useAuth";
import {BaseProvider, DarkTheme, LightTheme} from "baseui";
import React from "react";
import {StagesContextConsumer, StagesContextProvider} from "../lib/digitalstage/useStageContext";
import {RequestContextProvider} from "../lib/useRequest";
import Head from 'next/head'
import AppNavigation from "../components/AppNavigation";
import StageJoiner from "../components/stage/StageJoiner";
import {Block} from 'baseui/block';
import LocalDeviceControl from '../components/devices/LocalDeviceControl';
import {AudioContextProvider} from "../lib/useAudioContext";

class MyApp extends App {
    render() {
        const {Component, pageProps} = this.props;

        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                </Head>
                <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
                    <RequestContextProvider>
                        <AuthContextProvider>
                                <StagesContextProvider>
                                    <AudioContextProvider>
                                        <StagesContextConsumer>
                                            {({state}) => (
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
                                                    <div>
                                                        <pre>
                                                            {JSON.stringify(state, null, 2)}
                                                        </pre>
                                                    </div>
                                                </BaseProvider>
                                            )}
                                        </StagesContextConsumer>
                                    </AudioContextProvider>
                                </StagesContextProvider>
                        </AuthContextProvider>
                    </RequestContextProvider>
                </StyletronProvider>
            </>
        )
    }
}

export default MyApp;