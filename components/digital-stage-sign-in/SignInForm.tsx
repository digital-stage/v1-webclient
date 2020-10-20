import React, {useState, useEffect} from "react";
import {
    FormControlLabel,
    Link,
    Grid,
    Typography,
    Container,
    IconButton,
    Icon,
    makeStyles
} from "@material-ui/core";

import validator from 'validator';
import Input from "../base/Input";
import Button from "../base/Button";
import Checkbox from "../base/Checkbox";
import {useAuth} from "../../lib/digitalstage/useAuth";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        justifyContent: "center",
    },
    back: {
        borderRadius: "5px",
        color: "white",
        padding: theme.spacing(0),
        marginTop: theme.spacing(0),
    },
    form: {
        width: "70%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        textAlign: "center",
        padding: "0 !important",
    },
    submit: {
        margin: theme.spacing(1, 0, 1),
        borderRadius: "25px",
    },
    buttonGroup: {
        borderRadius: "50px",
        margin: theme.spacing(2, 0, 2, 0),
    },
}));

type Props = {
    history?: string[] | undefined,
}

export interface IError {
    email?: string;
    password?: string;
    response?: string;
}

export default function SignInForm(props: {
    onCompleted?: () => void
}) {
    const {signInWithEmailAndPassword} = useAuth();

    // Get auth state and re-render anytime it changes
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    //const [showAlert, setShowAlert] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);

    const [errors, setErrors] = useState<IError>({});

    const classes = useStyles();

    const validate = () => {
        const errorsList: IError = {}
        if (validator.isEmpty(email)) {
            errorsList.email = "Email is required"
        } else if (!validator.isEmail(email)) {
            errorsList.email = "Enter a valid email"
        }
        if (validator.isEmpty(password)) {
            errorsList.password = "Password is required"
        }
        setErrors(errorsList)
        return errorsList
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const handleCheckboxChange = (event) => setChecked(event.target.checked)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            return signInWithEmailAndPassword(email, password)
                .then(() => {
                    if (props.onCompleted)
                        props.onCompleted();
                })
                .catch(err => setErrors({
                    response: err.message
                }));
        }
    };

    return (
        <Container maxWidth="sm" className={classes.back}>
            {/* {showAlert && <div className="alert-box"><p>{auth.loginError}</p></div>} */}
            <div className={classes.paper}>
                <form className={classes.form} noValidate={true} onSubmit={handleSubmit}>
                    <Input
                        required={true}
                        id="email"
                        placeholder="Username"
                        name="email"
                        type="text"
                        error={errors && errors.email}
                        onChange={handleEmailChange}
                    />
                    <Input
                        required={true}
                        name="password"
                        placeholder="Password"
                        type="password"
                        id="password"
                        error={errors && errors.password}
                        onChange={handlePasswordChange}
                    />
                    <Checkbox
                        value="remember"
                        label="Stay signed in"
                        checked={checked}
                        handleChange={handleCheckboxChange}
                    />
                    <Button
                        color="primary"
                        text="Sign in"
                        type="submit"
                    />
                    {errors && errors.response && (
                        <div>

                        </div>
                    )}
                    <Typography variant="h6">Forgot password? </Typography>
                    <Typography variant="h6">Or Via</Typography>
                </form>
            </div>
        </Container>
    );
}
