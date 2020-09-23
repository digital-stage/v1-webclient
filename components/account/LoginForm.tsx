import React, {useEffect, useState} from "react";
import {Input} from "baseui/input";
import * as Yup from "yup";
import {Button, KIND} from "baseui/button";
import {useFormik} from "formik";
import Link from "next/link";
import Router from "next/router";
import {Notification} from "baseui/notification";
import {FormControl} from "baseui/form-control";
import {useAuth} from "../../lib/digitalstage/useAuth";

const Schema = Yup.object().shape({
    email: Yup.string()
        .email('Ungültige E-Mail Adresse')
        .required('Wird benötigt'),
    password: Yup.string()
        .required('Wird benötigt')
});

const LoginForm = (props: {
    onCompleted?: () => void,
    targetUrl?: string,
    backLink?: string
}) => {
    const [loginError, setError] = useState<string>();
    const {signInWithEmailAndPassword} = useAuth();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Schema,
        onSubmit: (values: {
            email: string,
            password: string
        }) =>
            signInWithEmailAndPassword(values.email, values.password)
                .then(() => {
                    setError(undefined);
                    if (props.onCompleted)
                        props.onCompleted();
                    if (props.targetUrl)
                        return Router.push(props.targetUrl);
                })
                .catch(err => {
                    if (err.message === "Unauthorized") {
                        console.log("CALLED 1");
                        setError("Falsches Passwort oder unbekannte E-Mail Adresse")
                    } else {
                        console.log("CALLED 2");
                        setError("Unbekannter Fehler: " + err.message);
                    }
                })
    });

    useEffect(() => {
        console.log("error is now");
        console.log(loginError);
    }, [loginError])

    return (
        <form onSubmit={formik.handleSubmit}>
            <FormControl
                label="E-Mail"
                error={formik.errors.email}
            >
                <Input type="email"
                       name="email"
                       required={true}
                       value={formik.values.email}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}/>
            </FormControl>
            <FormControl
                label="Passwort"
                error={formik.errors.password}
            >
                <Input type="password"
                       name="password"
                       required={true}
                       value={formik.values.password}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}/>
            </FormControl>


            {loginError && (
                <Notification kind='negative'>
                    {loginError}
                </Notification>
            )}

            <Button disabled={!formik.isValid} type="submit">
                Login
            </Button>
            {props.backLink && (
                <Link href={props.backLink}>
                    <Button kind={KIND.secondary}>
                        Back
                    </Button>
                </Link>
            )}
        </form>
    );
}
export default LoginForm;