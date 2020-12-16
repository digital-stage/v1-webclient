/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Heading, Text, Flex, Button, Message } from 'theme-ui';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import InputField from '../ui/InputField';
import { useAuth } from '../../lib/useAuth';
import Link from 'next/link';
import translateError from './translateError';

interface Values {
  email: string;
  repeatEmail: string;
}

const ForgetPasswordForm = (): JSX.Element => {
  const { requestPasswordReset } = useAuth();

  const [msg, setMsg] = React.useState({
    state: false,
    type: null,
    kids: null,
  });

  const ForgetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Bitte eine valide E-Mail-Adresse eingeben.')
      .required('E-Mail-Adresse wird benötigt'),
    repeatEmail: Yup.string()
      .oneOf([Yup.ref('email'), null], 'E-Mail-Adressen müssen gleich sein')
      .required('Die Wiederholung ist notwendig'),
  });

  return (
    <Box>
      <Box sx={{ textAlign: 'left' }}>
        <Heading as="h3" sx={{ mb: 5, fontSize: 3 }}>
          Passwort zurücksetzen
        </Heading>
        <Text mb={2}>Gibt Deine E-Mail-Adresse ein, um Dein Passwort zurückzusetzen</Text>
      </Box>
      <Formik
        initialValues={{ email: '', repeatEmail: '' }}
        validationSchema={ForgetPasswordSchema}
        // eslint-disable-next-line max-len
        onSubmit={async (values: Values, { resetForm }: FormikHelpers<Values>) =>
          requestPasswordReset(values.email)
            .then(() => {
              setMsg({
                state: true,
                type: 'success',
                kids: 'Link gesendet - prüfe Deine E-Mails',
              });
            })
            .catch((err) => {
              setMsg({
                state: true,
                type: 'danger',
                kids: translateError(err),
              });
            })
        }
      >
        {({ errors, touched }) => (
          <Form>
            {msg.state && <Message variant={msg.type}>{msg.kids}</Message>}

            <Field
              as={InputField}
              id="email"
              label="E-Mail-Adresse"
              name="email"
              type="text"
              error={errors.email && touched.email}
            />
            <Field
              as={InputField}
              id="repeatEmail"
              label="Wiederholung E-Mail-Adresse"
              name="repeatEmail"
              type="text"
              error={errors.repeatEmail && touched.repeatEmail}
            />
            <Flex sx={{ justifyContent: 'center', mt: 7 }}>
              <Link href="/account/login">
                <Button variant="tertiary">Abbrechen</Button>
              </Link>
              <Button type="submit">Senden</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ForgetPasswordForm;
