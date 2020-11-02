import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

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
  const [errors, setErrors] = useState<string[]>([]);
  const { children } = props;

  return (
    <ErrorsContext.Provider value={{
      errors,
      reportError: (error: string) => setErrors((prev) => [...prev, error]),
      clearErrors: () => setErrors([]),
    }}
    >
      {children}
      <Dialog open={errors.length > 0} onClose={() => setErrors([])}>
        <DialogTitle>Fehler</DialogTitle>
        <DialogContent>
          <ul>
            {errors.map((error) => <li>{error}</li>)}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrors([])} autoFocus>
            Ignorieren
          </Button>
        </DialogActions>
      </Dialog>
    </ErrorsContext.Provider>
  );
};
