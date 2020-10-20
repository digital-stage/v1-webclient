import * as Yup from "yup";
import {useFormik} from "formik";
import Router from "next/router";
import {useState} from "react";
import {FormControl} from "baseui/form-control";
import {Input} from "baseui/input";
import {Notification} from "baseui/notification";
import {Button, KIND} from "baseui/button";
import Link from "next/link";
import {Checkbox, LABEL_PLACEMENT} from "baseui/checkbox";
import {useAuth} from "../../../../lib/digitalstage/useAuth";

const Schema = Yup.object().shape({
    password: Yup.string()
        .min(10, 'Zu kurz')
        .max(50, 'Zu lang')
        .required('Wird benötigt'),
    confirmPassword: Yup.string()
        .required()
        .test('passwords-match', 'Die Passwörter stimmen nicht überein', function (value) {
            return this.parent.password === value;
        })
});

const ResetForm = (props: {
    resetToken: string,
    onCompleted?: () => void,
    targetUrl?: string,
    backLink?: string
}) => {
    const [error, setError] = useState<string>(null);
    const {resetPassword} = useAuth();

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Schema,
        onSubmit: (values) =>
            resetPassword(props.resetToken, values.password)
                .then(
                    () => {
                        setError(undefined);
                        if (props.onCompleted)
                            props.onCompleted();
                        if (props.targetUrl)
                            return Router.push(props.targetUrl);
                    }
                )
                .catch(error => setError(error.message))
    });


    return (
        <form onSubmit={formik.handleSubmit}>
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

            {error && (
                <Notification kind='negative'>
                    {error}
                </Notification>
            )}

            <Button disabled={!formik.isValid} type="submit">
                Passwort zurücksetzen
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
export default ResetForm;
