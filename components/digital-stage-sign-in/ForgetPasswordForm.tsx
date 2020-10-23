import React, { useState } from "react";
import {
    Typography,
    Container,
    makeStyles,
    Grid
} from "@material-ui/core";

import validator from 'validator';
import Input from "../base/Input";
import Button from "../base/Button";
import { useAuth } from "../../lib/digitalstage/useAuth";
import Alert from "../base/Alert";
import ResetLinkModal from "./ResetLinkModal";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
    },
    back: {
        padding: theme.spacing(0),
        marginTop: theme.spacing(0),
    },
    text: {
        textAlign: "left",
        padding: theme.spacing(2, 2, 0, 2)
    },
    marginTopBottom: {
        margin: theme.spacing(2, 0),
    }
}));

interface IError {
    email?: string;
    repeatEmail?: string;
    response?: string;
}

export default function ForgetPasswordForm(props: {
    onCompleted?: () => void,
    onClick: () => void
}) {
    const classes = useStyles();
    const { requestPasswordReset } = useAuth();
    const [email, setEmail] = useState<string>("");
    const [repeatEmail, setRepeatEmail] = useState<string>("");
    const [errors, setErrors] = useState<IError>({});
    const [open, setOpen] = React.useState(false);
    const [resend, setResend] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setResend(false)
    };

    const validate = () => {
        const errorsList: IError = {}
        if (validator.isEmpty(email)) {
            errorsList.email = "Email is required"
        }
        else if (!validator.isEmail(email)) {
            errorsList.email = "Enter a valid email"
        }
        else if (!validator.equals(email, repeatEmail)) {
            errorsList.email = "Emails must be the same"
        }
        if (validator.isEmpty(repeatEmail)) {
            errorsList.repeatEmail = "Email is required"
        }
        else if (!validator.isEmail(repeatEmail)) {
            errorsList.repeatEmail = "Enter a valid email"
        }
        else if (!validator.equals(email, repeatEmail)) {
            errorsList.repeatEmail = "Emails must be the same"
        }
        setErrors(errorsList)
        return errorsList
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const handleRepeatEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setRepeatEmail(e.target.value)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            return requestPasswordReset(email)
                .then(() => {
                    if (props.onCompleted)
                        props.onCompleted();
                    handleClickOpen();
                })
                .catch(err => setErrors({
                    response: err.message
                }));
        }
    };

    const handleResend = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            return requestPasswordReset(email)
                .then(() => {
                    if (props.onCompleted)
                        props.onCompleted();
                    setResend(true)
                })
                .catch(err => {
                    setErrors({
                        response: err.message
                    })
                    setResend(false)
                });
        }
    };

    return (
        <Container maxWidth="sm" className={classes.back}>
            <ResetLinkModal open={open} handleClose={handleClose} onClick={handleResend} resend={resend} />
            <div className={classes.paper}>
                {errors && errors.response && <Alert text={errors.response} severity="error" />}
                <form className={classes.form} noValidate={true} onSubmit={handleSubmit}>
                    <div className={classes.text}>
                        <Typography variant="h5">Reset your password</Typography>
                        <Typography variant="subtitle2">Enter your email address to restore your password</Typography>
                    </div>
                    <Input
                        required={true}
                        id="email"
                        placeholder="E-mail"
                        name="email"
                        type="text"
                        error={errors && errors.email}
                        onChange={handleEmailChange}
                    />
                    <Input
                        required={true}
                        id="repeatEmail"
                        placeholder="Repeat e-mail"
                        name="repeatEmail"
                        type="text"
                        error={errors && errors.repeatEmail}
                        onChange={handleRepeatEmailChange}
                    />
                    <Grid
                        container
                        justify="center"
                        className={classes.marginTopBottom}
                    >
                        <Button
                            color="light"
                            text="Cancel"
                            onClick={props.onClick}
                        />
                        <Button
                            color="primary"
                            text="Reset"
                            type="submit"
                        />
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
