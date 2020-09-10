import App from 'next/app'
import {Provider as StyletronProvider} from 'styletron-react'
import {styletron, debug} from '../styletron'
import {AuthContextProvider} from "../lib/useAuth";
import {SocketContextProvider} from "../lib/useSocket";
import {BaseProvider, DarkTheme} from "baseui";
import React from "react";
import {DeviceContextProvider} from "../lib/useDevice";
import {StageContextProvider} from "../lib/useStage";
import {StagesContextProvider} from "../lib/useStages";

class MyApp extends App {
    render() {
        const {Component, pageProps} = this.props
        return (
            <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
                <BaseProvider theme={DarkTheme}>
                    <AuthContextProvider>
                        <SocketContextProvider>
                            <DeviceContextProvider>
                                <StageContextProvider>
                                    <StagesContextProvider>
                                        <Component {...pageProps} />
                                    </StagesContextProvider>
                                </StageContextProvider>
                            </DeviceContextProvider>
                        </SocketContextProvider>
                    </AuthContextProvider>
                </BaseProvider>
            </StyletronProvider>
        )
    }
}

export default MyApp;