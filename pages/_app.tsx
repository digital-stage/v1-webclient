import App from 'next/app'
import {Provider as StyletronProvider} from 'styletron-react'
import {styletron, debug} from '../styletron'
import {AuthContextProvider} from "../lib/digitalstage/useAuth";
import {BaseProvider, DarkTheme} from "baseui";
import React from "react";
import {DeviceContextProvider} from "../lib/digitalstage/useDevices";
import {StageContextProvider} from "../lib/useStage";
import {StagesContextProvider} from "../lib/digitalstage/useStages";

class MyApp extends App {
    render() {
        const {Component, pageProps} = this.props
        return (
            <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
                <BaseProvider theme={DarkTheme}>
                    <AuthContextProvider>
                        <DeviceContextProvider>
                            <StagesContextProvider>
                                <Component {...pageProps} />
                            </StagesContextProvider>
                        </DeviceContextProvider>
                    </AuthContextProvider>
                </BaseProvider>
            </StyletronProvider>
        )
    }
}

export default MyApp;