import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { AuthContextConsumer, AuthContextProvider } from '../lib/useAuth';
import StageJoiner from '../components/global/StageJoiner';
import { AudioContextProvider } from '../lib/useAudioContext';
import { StageWebAudioProvider } from '../lib/useStageWebAudio';
import { ErrorsConsumer } from '../lib/useErrors';
import { DigitalStageProvider } from '../lib/use-digital-stage';
import { StageJoinerProvider } from '../lib/useStageJoiner';
import useAudioOutput from '../lib/useAudioOutput';
import { useRouter } from 'next/router';
import * as locales from '../content/locale';
import { IntlProvider } from 'react-intl';
import ThemeProvider from '../digitalstage-ui/ThemeProvider';
import { ColorProvider } from '../lib/useColors';
import './../digitalstage-ui/transitions.css';
import MainLayout from '../components/layout/MainLayout';
import { NextComponentType, NextPageContext } from 'next/dist/next-server/lib/utils';

type AppPropsWithLayout = AppProps & {
  Component: NextComponentType<NextPageContext, any> & {
    Layout: React.FunctionComponent;
  };
};

const AudioOutputSwitcher = () => {
  useAudioOutput();
  return null;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();
  const { locale, defaultLocale } = router;
  const localeCopy = locales[locale];
  const messages = localeCopy['default'];
  const CustomLayout = Component.Layout ? Component.Layout : React.Fragment;

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

      <ThemeProvider>
        <ColorProvider>
          <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
            <ErrorsConsumer>
              {({ reportError }) => (
                <AuthContextProvider>
                  <AuthContextConsumer>
                    {({ token }) => (
                      <DigitalStageProvider
                        apiUrl={process.env.NEXT_PUBLIC_API_URL}
                        routerDistributorUrl={process.env.NEXT_PUBLIC_ROUTER_DISTRIBUTOR_URL}
                        standaloneRouterUrl={
                          process.env.NEXT_PUBLIC_ROUTER_DISTRIBUTOR_URL
                            ? undefined
                            : process.env.NEXT_PUBLIC_ROUTER_URL
                        }
                        token={token}
                        addErrorHandler={reportError}
                      >
                        <AudioContextProvider>
                          <StageWebAudioProvider handleError={reportError}>
                            <StageJoinerProvider>
                              <MainLayout>
                                <CustomLayout>
                                  {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                                  <Component {...pageProps} />
                                  <StageJoiner />
                                </CustomLayout>
                              </MainLayout>
                              <AudioOutputSwitcher />
                            </StageJoinerProvider>
                          </StageWebAudioProvider>
                        </AudioContextProvider>
                      </DigitalStageProvider>
                    )}
                  </AuthContextConsumer>
                </AuthContextProvider>
              )}
            </ErrorsConsumer>
          </IntlProvider>
        </ColorProvider>
      </ThemeProvider>
    </>
  );
};
export default MyApp;
