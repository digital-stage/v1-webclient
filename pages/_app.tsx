import App from 'next/app'
import {Provider as StyletronProvider} from 'styletron-react'
import {debug, styletron} from '../styletron'
import {AuthContextProvider} from "../lib/digitalstage/useAuth";
import {BaseProvider, DarkTheme, LightTheme} from "baseui";
import React from "react";
import {DeviceContextProvider} from "../lib/digitalstage/useDevices";
import {StagesContextConsumer, StagesContextProvider} from "../lib/digitalstage/useStages";
import {RequestContextProvider} from "../lib/useRequest";
import Head from 'next/head'

class MyApp extends App {
    render() {
        const {Component, pageProps} = this.props
        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                </Head>
                <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
                    <RequestContextProvider>
                        <AuthContextProvider>
                            <DeviceContextProvider>
                                <StagesContextProvider>
                                    <StagesContextConsumer>
                                        {({stageId}) => (
                                            <BaseProvider theme={stageId ? DarkTheme : LightTheme}>
                                                <style jsx global>{`
                                            html, body {
                                                margin: 0;
                                                padding: 0;
                                                width: 100%;
                                            }
                                            body {
                                                font-family: var(--font-sans);
                                                color: ${stageId ? "#ffffff" : "#000000"};
                                                background-color: ${stageId ? "#000000" : "#ffffff"};
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
                                                <Component {...pageProps} />
                                            </BaseProvider>
                                        )}
                                    </StagesContextConsumer>
                                </StagesContextProvider>
                            </DeviceContextProvider>
                        </AuthContextProvider>
                    </RequestContextProvider>
                </StyletronProvider>
            </>
        )
    }
}

export default MyApp;