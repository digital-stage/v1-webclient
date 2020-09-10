import React, {useState} from "react";
import {Input} from "baseui/input";
import * as Yup from "yup";
import {Button, KIND} from "baseui/button";
import {useFormik} from "formik";
import * as firebase from "firebase/app";
import 'firebase/auth';
import Link from "next/link";
import Router from "next/router";
import {Notification} from "baseui/notification";
import {FormControl} from "baseui/form-control";

const Schema = Yup.object().shape({
    email: Yup.string()
        .email('Ungültige E-Mail Adresse')
        .required('Wird benötigt'),
    password: Yup.string()
        .required('Wird benötigt')
});

export default (props: {
    onCompleted?: () => void,
    targetUrl?: string,
    backLink?: string
}) => {
    const [error, setError] = useState<string>(null);
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Schema,
        onSubmit: (values: {
            email: string,
            password: string
        }) => {
            firebase.auth().signInWithEmailAndPassword(
                values.email, values.password
            ).then(
                () => {
                    if (props.onCompleted)
                        props.onCompleted();
                    if (props.targetUrl)
                        Router.push(props.targetUrl);
                }
            ).catch(
                (error) => setError(error.message)
            );
        },
    });

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

            {error && (
                <Notification kind='negative'>
                    {error}
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
