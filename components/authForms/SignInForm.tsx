/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import Link from 'next/link';
import { jsx, Box, Button, Flex, Label, Text, Message } from 'theme-ui';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../lib/useAuth';
import InputField from '../InputField';

export interface Values {
  email: string;
  password: string;
  staySignedIn: boolean;
}
export interface IError {
  email?: string;
  password?: string;
  staySignedIn?: boolean;
}

const SignInForm = (): JSX.Element => {
  const { signInWithEmailAndPassword } = useAuth();

  const [msg, setMsg] = React.useState({
    state: false,
    type: null,
    kids: null,
  });

  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email('Bitte eine valide E-Mail-Adresse eingeben')
      .required('E-Mail-Adresse wird benötigt'),
    password: Yup.string().required('Das Passwort ist notwendig'),
  });

  return (
    <Box>
      <Formik
        initialValues={{
          email: '',
          password: '',
          staySignedIn: false,
        }}
        validationSchema={SignInSchema}
        // eslint-disable-next-line max-len
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) =>
          signInWithEmailAndPassword(values.email, values.password, values.staySignedIn)
            .then(() => {
              resetForm(null);
            })
            .catch((err) =>
              setMsg({
                state: true,
                type: 'danger',
                kids: { err },
              })
            )
        }
      >
        {({ errors, touched }) => (
          <Form>
            {msg.state && <Message variant={msg.type}>{msg.kids}</Message>}

            <Field
              as={InputField}
              id="email"
              label="E-Mail-Adresse"
              type="text"
              name="email"
              autocomplete="email"
              error={errors.email && touched.email}
            />
            <Field
              as={InputField}
              id="password"
              label="Passwort"
              name="password"
              type="password"
              autocomplete="current-password"
              error={errors.password && touched.password}
            />
            <Label sx={{ mt: 3 }}>
              <Field type="checkbox" name="staySignedIn" />
              <Text sx={{ fontSize: 14, ml: 2 }}>Angemeldet bleiben</Text>
            </Label>
            <Flex sx={{ justifyContent: 'center', my: 3 }}>
              <Button type="submit">Einloggen</Button>
            </Flex>
          </Form>
        )}
      </Formik>

      <Flex sx={{ justifyContent: 'center', mt: 4, mb: 2 }}>
        <Link href="/account/forgot">
          <Button as="a" variant="text">
            Passwort vergessen?
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default SignInForm;
