import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, LightTheme } from 'baseui';
import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { debug, styletron } from '../styletron';
import { AuthContextProvider } from '../lib/digitalstage/useAuth';
import { SocketContextProvider } from '../lib/digitalstage/useStageContext';
import { RequestContextProvider } from '../lib/useRequest';
import StageJoiner from '../components/new/elements/StageJoiner';
import { AudioContextProvider } from '../lib/useAudioContext';
import { MediasoupProvider } from '../lib/digitalstage/useMediasoup';
import { wrapper } from '../lib/digitalstage/useStageContext/redux';
import StageWebAudioProvider from '../lib/useStageWebAudio';
import { ErrorsProvider } from '../lib/useErrors';
import DarkTheme from '../uikit/Theme';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
    </Head>
    <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
      <ErrorsProvider>
        <RequestContextProvider>
          <AuthContextProvider>
            <SocketContextProvider>
              <MediasoupProvider>
                <AudioContextProvider>
                  <BaseProvider theme={DarkTheme}>
                    <style jsx global>
                      {`
                          @import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Poppins:wght@600&display=swap');
                          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');
                          @import("https://use.fontawesome.com/releases/v5.12.0/css/all.css");
                          * {
                              box-sizing: border-box;
                          }
                          html {
                              height: -webkit-fill-available;
                          }
                          html, body {
                              margin: 0;
                              padding: 0;
                          }
                          body {
                              min-height: 100vh;
                              min-height: -webkit-fill-available;
                              font-family: var(--font-sans);
                              color: #ffffff;
                              background-color: #343434;
                              background: linear-gradient(218deg, rgba(52,52,52,1) 0%, rgba(20,20,20,1) 100%);
                              background-repeat: no-repeat;
                              background-attachment: fixed;
                              background-size: cover;
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
                          @keyframes ripple {
                            to {
                              opacity: 0;
                              transform: scale(2);
                            }
                          }
                      `}
                    </style>
                    <StageWebAudioProvider>
                      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                      <Component {...pageProps} />
                    </StageWebAudioProvider>

                    <StageJoiner />

                  </BaseProvider>
                </AudioContextProvider>
              </MediasoupProvider>
            </SocketContextProvider>
          </AuthContextProvider>
        </RequestContextProvider>
      </ErrorsProvider>
    </StyletronProvider>
  </>
);
export default wrapper.withRedux(MyApp);
