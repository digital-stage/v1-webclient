/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Button } from 'theme-ui';
import {
  Modal, ModalBody, ModalFooter, ModalHeader,
} from 'baseui/modal';

export interface ErrorsProps {
  errors: string[];
  reportError: (error: string) => any;
  clearErrors: () => any;
}

const ErrorsContext = React.createContext<ErrorsProps>({
  errors: [],
  reportError: () => {},
  clearErrors: () => {},
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
        <ModalHeader>Fehler</ModalHeader>
        <ModalBody>
          <ul>
            {errors.map((error) => (
              <li>{error}</li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setErrors([])}>Schliessen</Button>
        </ModalFooter>
      </Modal>
    </ErrorsContext.Provider>
  );
};
