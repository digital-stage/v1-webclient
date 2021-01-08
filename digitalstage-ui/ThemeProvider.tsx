import DigitalStageTheme from './theme/DigitalStageTheme';
import { ThemeProvider as ThemenProviderThemeUi } from 'theme-ui';
import React from 'react';

const ThemeProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;

  return <ThemenProviderThemeUi theme={DigitalStageTheme}>{children}</ThemenProviderThemeUi>;
};

export default ThemeProvider;
