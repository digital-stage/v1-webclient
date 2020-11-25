import * as React from 'react';
import { useCallback, useEffect } from 'react';
import debug from 'debug';

const d = debug('useErrors');
const printWarning = d.extend('warn');
const printError = d.extend('err');

export interface ErrorsProps {
  warnings: Error[];
  reportWarning: (warning: Error) => void;
  errors: Error[];
  reportError: (error: Error) => void;
  clear: () => void;
}

const Context = React.createContext<ErrorsProps>({
  warnings: [],
  reportWarning: () => {
    // do nothing.
  },
  errors: [],
  reportError: () => {
    // do nothing.
  },
  clear: () => {
    // do nothing.
  },
});

export const useErrors = (): ErrorsProps => React.useContext<ErrorsProps>(Context);

export const ErrorsConsumer = Context.Consumer;

export const ErrorsProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const [warnings, setWarnings] = React.useState<Error[]>([]);
  const [errors, setErrors] = React.useState<Error[]>([]);
  const { children } = props;

  useEffect(() => {
    errors.forEach((error) => {
      console.error(error);
      printError(error);
    });
  }, [errors]);

  useEffect(() => {
    warnings.forEach((warning) => {
      console.warn(warning);
      printWarning(warning);
    });
  }, [warnings]);

  const reportWarning = useCallback((warning: Error) => {
    setWarnings((prev) => [...prev, warning]);
  }, []);

  const reportError = useCallback((error: Error) => {
    setErrors((prev) => [...prev, error]);
  }, []);

  const clear = useCallback(() => {
    setWarnings([]);
    setErrors([]);
  }, []);

  return (
    <Context.Provider
      value={{
        warnings,
        reportWarning,
        errors,
        reportError,
        clear,
      }}
    >
      {children}
    </Context.Provider>
  );
};
