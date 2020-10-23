import React, { useState } from "react";
import {
    Typography,
    Container,
    makeStyles,
    Grid
} from "@material-ui/core";
import Router from "next/router";

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
    password?: string;
    repeatPassword?: string;
    response?: string;
}

export default function ResetPasswordForm(props: {
    onCompleted?: () => void,
    resetToken: string,
    targetUrl?: string
}) {
    const classes = useStyles();
    const { resetPassword } = useAuth();
    const [errors, setErrors] = useState<IError>({});
    const [open, setOpen] = React.useState(false);
    const [resend, setResend] = React.useState(false);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setResend(false)
    };

    const validate = () => {
        const errorsList: IError = {}

        if (validator.isEmpty(password)) {
            errorsList.password = "Password is required"
        }
        else if (!validator.matches(password, '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$')) {
            errorsList.password = "8 characters, 1 number and 1 uppercase letter"
        }
        if (validator.isEmpty(repeatPassword)) {
            errorsList.repeatPassword = "Repeat password"
        }
        if (!validator.equals(password, repeatPassword)) {
            errorsList.repeatPassword = "Passwords must be equal"
            errorsList.password = "Passwords must be equal"
        }
        setErrors(errorsList)
        return errorsList
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
    const handleReapeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            return resetPassword(props.resetToken, password)
                .then(
                    () => {
                        if (props.onCompleted)
                            props.onCompleted();
                        if (props.targetUrl)
                            return Router.push(props.targetUrl);
                    }
                )
                .catch(err => setErrors({
                    response: err.message
                }));
        }
    };

    return (
        <Container maxWidth="sm" className={classes.back}>
            <div className={classes.paper}>
                {errors && errors.response && <Alert text={errors.response} severity="error" />}
                <form noValidate={true} onSubmit={handleSubmit}>
                    <Grid
                        container
                        justify="center"
                        className={classes.marginTopBottom}
                    >
                        <div className={classes.text}>
                            <Typography variant="h5">Create new password</Typography>
                            <Typography variant="subtitle2">8 characters, 1 number and 1 uppercase letter</Typography>
                        </div>
                        <Input
                            required={true}
                            id="passwrod"
                            placeholder="Password"
                            name="password"
                            type="password"
                            error={errors && errors.password}
                            onChange={handlePasswordChange}
                        />
                        <Input
                            required={true}
                            id="Repeat password"
                            placeholder="Repeat password"
                            type="password"
                            name="password"
                            error={errors && errors.repeatPassword}
                            onChange={handleReapeatPasswordChange}
                        />
                        <Grid
                            className={classes.marginTopBottom}
                        >
                            <Button
                                color="primary"
                                text="Create new password"
                                type="submit"
                            /></Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
