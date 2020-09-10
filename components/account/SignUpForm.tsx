import * as Yup from "yup";
import {useFormik} from "formik";
import Router from "next/router";
import {useState} from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import {FormControl} from "baseui/form-control";
import {Input} from "baseui/input";
import {Notification} from "baseui/notification";
import {Button, KIND} from "baseui/button";
import Link from "next/link";
import {Checkbox, LABEL_PLACEMENT} from "baseui/checkbox";

const Schema = Yup.object().shape({
    displayName: Yup.string()
        .min(2, 'Zu kurz')
        .max(50, 'Zu lang'),
    email: Yup.string()
        .email('Ungültige E-Mail Adresse')
        .required('Wird benötigt'),
    password: Yup.string()
        .min(10, 'Zu kurz')
        .max(50, 'Zu lang')
        .required('Wird benötigt'),
    confirmPassword: Yup.string()
        .required()
        .test('passwords-match', 'Passwords must match ya fool', function (value) {
            return this.parent.password === value;
        }),
    agreeToTerms: Yup.boolean()
        .test(
            'is-true',
            'Bitte lese und akzeptiere unsere Datenschutzbestimmungen',
            value => value === true
        ),
});

export default (props: {
    onCompleted?: () => void,
    targetUrl?: string,
    backLink?: string
}) => {
    const [error, setError] = useState<string>(null);

    const formik = useFormik({
        initialValues: {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false
        },
        validationSchema: Schema,
        onSubmit: (values) => {
            firebase.auth()
                .createUserWithEmailAndPassword(
                    values.email,
                    values.password
                ).then(
                (user) => {
                    user.user.updateProfile({
                        displayName: values.displayName
                    })
                        .then(
                            () => {
                                if (props.onCompleted)
                                    props.onCompleted();
                                if (props.targetUrl)
                                    Router.push(props.targetUrl);
                            }
                        )
                        .catch(
                            error => setError(error.message)
                        );
                })
                .catch(
                    error => setError(error.message)
                );
        },
    });


    return (
        <form onSubmit={formik.handleSubmit}>
            <FormControl
                label="Name"
                error={formik.errors.displayName}
            >
                <Input
                    required
                    name="displayName"
                    value={formik.values.displayName}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl
                label="E-Mail Adresse"
                error={formik.errors.email}
            >
                <Input
                    required
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </FormControl>
            <FormControl
                label="Passwort"
                error={formik.errors.password}
            >
                <Input
                    required
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </FormControl>
            <FormControl
                label="Passwort bestätigen"
                error={formik.errors.confirmPassword}
            >
                <Input
                    required
                    name="confirmPassword"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </FormControl>
            <FormControl
                error={formik.errors.agreeToTerms}
            >
                <Checkbox
                    required
                    name="agreeToTerms"
                    labelPlacement={LABEL_PLACEMENT.right}
                    checked={formik.values.agreeToTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    Durch die Nutzung dieser Website stimmst du der Verwendung von Cookies zu. Weitere
                    Informationen dazu findest du in unserer Datenschutzerklärung / Impressum.
                </Checkbox>
            </FormControl>

            {error && (
                <Notification kind='negative'>
                    {error}
                </Notification>
            )}

            <Button isLoading={formik.isSubmitting} disabled={!formik.isValid} type="submit">
                Registrieren
            </Button>
            {props.backLink && (
                <Link href={props.backLink}>
                    <Button kind={KIND.secondary}>
                        Zurück
                    </Button>
                </Link>
            )}

        </form>
    )
};
