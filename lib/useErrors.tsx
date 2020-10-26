import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import i18n from "../i18n";

export interface ErrorsProps {
    errors: string[],
    reportError: (error: string) => any;
    clearErrors: () => any;
}

const ErrorsContext = React.createContext<ErrorsProps>({
    errors: [],
    reportError: () => {},
    clearErrors: () => {}
});

export const useErrors = (): ErrorsProps => React.useContext<ErrorsProps>(ErrorsContext);

export const ErrorsProvider = (props: {
    children: React.ReactNode
}) => {
    const {t} = i18n.useTranslation("common");
    const [errors, setErrors] = useState<string[]>([]);

    return (
        <ErrorsContext.Provider value={{
            errors: errors,
            reportError: (error: string) => setErrors(prev => [...prev, error]),
            clearErrors: () => setErrors([])
        }}>
            {props.children}
            <Dialog open={errors.length > 0} onClose={() => setErrors([])}>
                <DialogTitle>{t('errorTitle')}</DialogTitle>
                <DialogContent>
                    <ul>
                        {errors.map(error => <li>{error}</li>)}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrors([])} autoFocus>
                        {t('closeError')}
                    </Button>
                </DialogActions>
            </Dialog>
        </ErrorsContext.Provider>
    )
}