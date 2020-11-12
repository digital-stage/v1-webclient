import * as React from 'react';

export interface ErrorsProps {
  warnings: Error[];
  reportWarning: (warning: Error) => any;
  errors: Error[];
  reportError: (error: Error) => any;
  clear: () => any;
}

const ErrorsContext = React.createContext<ErrorsProps>({
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

export const useErrors = (): ErrorsProps => React.useContext<ErrorsProps>(ErrorsContext);

export const ErrorsProvider = (props: { children: React.ReactNode }) => {
  const [warnings, setWarnings] = React.useState<Error[]>([]);
  const [errors, setErrors] = React.useState<Error[]>([]);
  const { children } = props;

  return (
    <ErrorsContext.Provider
      value={{
        warnings,
        reportWarning: (warning: Error) => setWarnings((prev) => [...prev, warning]),
        errors,
        reportError: (error: Error) => setErrors((prev) => [...prev, error]),
        clear: () => setErrors([]),
      }}
    >
      {children}
    </ErrorsContext.Provider>
  );
};
