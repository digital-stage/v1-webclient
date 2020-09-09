import App from 'next/app'
import {Provider as StyletronProvider} from 'styletron-react'
import {styletron, debug} from '../styletron'
import {AuthContextProvider} from "../lib/useAuth";
import {SocketContextProvider} from "../lib/useSocket";
import {BaseProvider, DarkTheme} from "baseui";
import React from "react";

class MyApp extends App {
    render() {
        const {Component, pageProps} = this.props
        return (
            <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
                <BaseProvider theme={DarkTheme}>
                    <AuthContextProvider>
                        <SocketContextProvider>
                            <Component {...pageProps} />
                        </SocketContextProvider>
                    </AuthContextProvider>
                </BaseProvider>
            </StyletronProvider>
        )
    }
}

export default MyApp;