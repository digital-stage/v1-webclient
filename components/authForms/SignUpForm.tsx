/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Button, Flex, Message } from 'theme-ui';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../lib/digitalstage/useAuth';
import InputField from '../InputField';

interface Values {
  email: string;
  name: string;
  password: string;
  passwordRepeat: string;
}

const SignUpForm = (): JSX.Element => {
  const { createUserWithEmailAndPassword } = useAuth();

  const [msg, setMsg] = React.useState({
    state: false,
    type: null,
    kids: null,
  });

  const SignUpSchema = Yup.object().shape({
    email: Yup.string()
      .email('Bitte eine valide E-Mail-Adresse eingeben.')
      .required('E-Mail-Adresse wird benötigt'),
    name: Yup.string()
      .min(2, 'Der Name ist kurz')
      .max(70, 'Der Name ist zu lang')
      .required('Der Name ist notwendig'),
    password: Yup.string()
      .min(8, 'Das Passwort muss eine Mindestlänge von 8 Zeichen haben')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        'Das Passwort muss folgendes beinhalten: mindestens eine Zahl, ein kleiner und ein großer Buchstabe sowie insgesamt eine Länge von 8 Zeichen haben'
      )
      .required('Passwort wird benötigt'),
    passwordRepeat: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Die Passwörter müssen identisch sein')
      .required('Die Passwortwiederholung wird benötigt'),
  });

  return (
    <Box>
      <Formik
        initialValues={{
          email: '',
          name: '',
          password: '',
          passwordRepeat: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) =>
          createUserWithEmailAndPassword(values.email, values.password, values.name)
            .then((res) => {
              if (res === 201) {
                setMsg({
                  state: true,
                  type: 'success',
                  kids: 'Jetzt kannst Du Dich mit Deinem neuen Account anmelden',
                });
                resetForm(null);
              } else {
                setMsg({
                  state: true,
                  type: 'warning',
                  kids: 'Oops - versuche es noch einmal',
                });
              }
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
              type="text"
              label="E-Mail-Adresse"
              name="email"
              error={errors.email && touched.email}
            />

            <Field
              as={InputField}
              id="name"
              label="Name"
              name="name"
              type="text"
              error={errors.name && touched.name}
            />
            <Field
              as={InputField}
              id="password"
              label="Passwort"
              name="password"
              type="password"
              error={errors.password && touched.password}
            />
            <Field
              as={InputField}
              id="passwordRepeat"
              label="Passwort Wiederholung"
              type="password"
              name="passwordRepeat"
              error={errors.passwordRepeat && touched.passwordRepeat}
            />
            <Flex sx={{ justifyContent: 'center', my: 3 }}>
              <Button type="submit">Registrierung</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignUpForm;
