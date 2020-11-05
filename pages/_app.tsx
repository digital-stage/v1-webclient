import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider as ThemenProviderThemeUi } from 'theme-ui';
import theme from '../utils/theme';
import { AuthContextProvider } from '../lib/digitalstage/useAuth';
import { SocketContextProvider } from '../lib/digitalstage/useStageContext';
import { RequestContextProvider } from '../lib/useRequest';
import StageJoiner from '../components/new/elements/StageJoiner';
import { AudioContextProvider } from '../lib/useAudioContext';
import { MediasoupProvider } from '../lib/digitalstage/useMediasoup';
import { wrapper } from '../lib/digitalstage/useStageContext/redux';
import StageWebAudioProvider from '../lib/useStageWebAudio';
import { ErrorsProvider } from '../lib/useErrors';
import { ProvideStage } from '../components/stage/useStage';

const MyApp = ({ Component, pageProps }: AppProps) => {
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
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ErrorsProvider>
        <RequestContextProvider>
          <AuthContextProvider>
            <SocketContextProvider>
              <MediasoupProvider>
                <AudioContextProvider>
                  <ThemenProviderThemeUi theme={theme}>
                    <StageWebAudioProvider>
                      <ProvideStage>
                        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                        <Component {...pageProps} />
                      </ProvideStage>
                    </StageWebAudioProvider>
                    <StageJoiner />
                  </ThemenProviderThemeUi>
                </AudioContextProvider>
              </MediasoupProvider>
            </SocketContextProvider>
          </AuthContextProvider>
        </RequestContextProvider>
      </ErrorsProvider>
    </>
  );
};
export default wrapper.withRedux(MyApp);
