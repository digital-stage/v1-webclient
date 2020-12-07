import React, { useEffect, useState } from 'react';
import { useAuth } from '../../lib/useAuth';
import { Button, Message } from 'theme-ui';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import translateError from './translateError';
import InputField from '../InputField';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

export interface Values {
  email: string;
}

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Bitte eine valide E-Mail-Adresse eingeben')
    .required('E-Mail-Adresse wird benötigt'),
});

const ResendActivationForm = (): JSX.Element => {
  const { push } = useRouter();
  const [message, setMessage] = useState<string>();
  const { loading, user, resendActivationLink } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      push('/');
    }
  }, [loading, user, push]);

  const notification = message ? <Message variant="danger">{message}</Message> : null;

  return (
    <div>
      {notification}
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={Schema}
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) => {
          setMessage(undefined);
          return resendActivationLink(values.email)
            .then(() => {
              resetForm(null);
            })
            .catch((err) => {
              setMessage(translateError(err));
            });
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={InputField}
              id="email"
              label="E-Mail-Adresse"
              type="text"
              name="email"
              autocomplete="email"
              error={errors.email && touched.email}
            />
            <Button type="submit">Aktivierungs-Link zusenden</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default ResendActivationForm;
