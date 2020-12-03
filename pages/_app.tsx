import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider as ThemenProviderThemeUi } from 'theme-ui';
import theme from '../utils/theme';
import { AuthContextConsumer, AuthContextProvider } from '../lib/useAuth';
import StageJoiner from '../components/new/elements/StageJoiner';
import { AudioContextProvider } from '../lib/useAudioContext';
import { StageWebAudioProvider } from '../lib/useStageWebAudio';
import { ErrorsConsumer } from '../lib/useErrors';
import ErrorHandler from '../components/ErrorHandler';
import { DigitalStageProvider } from '../lib/use-digital-stage';
import { StageJoinerProvider } from '../lib/useStageJoiner';

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
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <ThemenProviderThemeUi theme={theme}>
        <ErrorsConsumer>
          {({ reportError }) => (
            <AuthContextProvider>
              <AuthContextConsumer>
                {({ token }) => (
                  <DigitalStageProvider
                    apiUrl={process.env.NEXT_PUBLIC_API_URL}
                    routerDistUrl={process.env.NEXT_PUBLIC_ROUTERS_URL}
                    token={token}
                    addErrorHandler={reportError}
                  >
                    <AudioContextProvider>
                      <StageWebAudioProvider handleError={reportError}>
                        <StageJoinerProvider>
                          <ErrorHandler>
                            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                            <Component {...pageProps} />
                            <StageJoiner />
                          </ErrorHandler>
                        </StageJoinerProvider>
                      </StageWebAudioProvider>
                    </AudioContextProvider>
                  </DigitalStageProvider>
                )}
              </AuthContextConsumer>
            </AuthContextProvider>
          )}
        </ErrorsConsumer>
      </ThemenProviderThemeUi>
    </>
  );
};
export default MyApp;
