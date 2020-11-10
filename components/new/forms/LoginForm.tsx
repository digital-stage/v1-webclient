import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Router from 'next/router';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Notification } from 'baseui/notification';
import { Button, KIND } from 'baseui/button';
import Link from 'next/link';
import { useAuth } from '../../../lib/digitalstage/useAuth';

const Schema = Yup.object().shape({
  email: Yup.string().email('Ungültige E-Mail Adresse').required('Wird benötigt'),
  password: Yup.string().required('Wird benötigt'),
});
const LoginForm = (props: { onCompleted?: () => void; targetUrl?: string; backLink?: string }) => {
  const { onCompleted, targetUrl, backLink } = props;
  const [loginError, setError] = useState<string>();
  const { signInWithEmailAndPassword } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Schema,
    onSubmit: (values: { email: string; password: string }) =>
      signInWithEmailAndPassword(values.email, values.password)
        .then(() => {
          setError(undefined);
          if (onCompleted) {
            onCompleted();
          }
          if (targetUrl) {
            return Router.push(targetUrl);
          }
          return null;
        })
        .catch((err) => {
          if (err.message === 'Unauthorized') {
            setError('Falsches Passwort oder unbekannte E-Mail Adresse');
          } else {
            setError(`Unbekannter Fehler: ${err.message}`);
          }
        }),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl
        label="E-Mail"
        error={formik.errors.email}
        overrides={{
          Label: {
            style: {
              color: 'inherit',
            },
          },
        }}
      >
        <Input
          type="email"
          name="email"
          required
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </FormControl>
      <FormControl
        overrides={{
          Label: {
            style: {
              color: 'inherit',
            },
          },
        }}
        label="Passwort"
        error={formik.errors.password}
      >
        <Input
          type="password"
          name="password"
          required
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </FormControl>

      {loginError && <Notification kind="negative">{loginError}</Notification>}

      <Button disabled={!formik.isValid} type="submit">
        Login
      </Button>
      {backLink && (
        <Link href={backLink}>
          <Button kind={KIND.secondary}>Back</Button>
        </Link>
      )}
    </form>
  );
};
export default LoginForm;
