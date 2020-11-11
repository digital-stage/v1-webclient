/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Button, Heading } from 'theme-ui';
import Modal from '../components/new/elements/Modal';

export interface ErrorsProps {
  errors: string[];
  reportError: (error: string) => any;
  clearErrors: () => any;
}

const ErrorsContext = React.createContext<ErrorsProps>({
  errors: [],
  reportError: () => {
    // do nothing.
  },
  clearErrors: () => {
    // do nothing.
  },
});

export const useErrors = (): ErrorsProps => React.useContext<ErrorsProps>(ErrorsContext);

export const ErrorsProvider = (props: { children: React.ReactNode }) => {
  const [errors, setErrors] = React.useState<string[]>([]);
  const { children } = props;

  return (
    <ErrorsContext.Provider
      value={{
        errors,
        reportError: (error: string) => setErrors((prev) => [...prev, error]),
        clearErrors: () => setErrors([]),
      }}
    >
      {children}
      <Modal isOpen={errors.length > 0} onClose={() => setErrors([])}>
        <Heading>Fehler</Heading>
        <Box>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Box>
        <Button onClick={() => setErrors([])}>Schliessen</Button>
      </Modal>
    </ErrorsContext.Provider>
  );
};
