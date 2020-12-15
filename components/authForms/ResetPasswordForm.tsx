/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { useRouter } from 'next/router';
import { jsx, Box, Heading, Text, Flex, Button, Message } from 'theme-ui';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import InputField from '../ui/InputField';
import { useAuth } from '../../lib/useAuth';
import translateError from './translateError';

interface Values {
  password?: string;
  repeatPassword?: string;
  response?: string;
}

interface Props {
  resetToken: string;
}

export default function ResetPasswordForm({ resetToken }: Props): JSX.Element {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [msg, setMsg] = React.useState({
    state: false,
    type: null,
    kids: null,
  });

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Das Passwort muss eine Mindestlänge von 8 Zeichen haben')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        'Das Passwort muss folgendes beinhalten: mindestens eine Zahl, ein kleiner und ein großer Buchstabe sowie insgesamt eine Länge von 8 Zeichen haben'
      )
      .required('Passwort wird benötigt'),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Die Passwörter müssen identisch sein')
      .required('Die Passwortwiederholung wird benötigt'),
  });

  return (
    <Box>
      <Formik
        initialValues={{
          password: '',
          repeatPassword: '',
        }}
        validationSchema={ResetPasswordSchema}
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) =>
          resetPassword(resetToken, values.password)
            .then(() => {
              resetForm(null);
              router.push('/account/login');
            })
            .catch((err) =>
              setMsg({
                state: true,
                type: 'danger',
                kids: translateError(err),
              })
            )
        }
      >
        {({ errors, touched }) => (
          <Form>
            <Box sx={{ textAlign: 'left' }}>
              <Heading as="h3" sx={{ my: 3, fontSize: 3 }}>
                Setze eine neues Passwort
              </Heading>
              <Text>
                Das Passwort muss folgendes beinhalten: mindestens eine Zahl, ein kleiner und ein
                großer Buchstabe sowie insgesamt eine Länge von 8 Zeichen haben
              </Text>
            </Box>

            {msg.state && <Message variant={msg.type}>{msg.kids}</Message>}

            <Field
              as={InputField}
              id="password"
              label="Password"
              name="password"
              type="password"
              error={errors.password && touched.password}
            />
            <Field
              as={InputField}
              id="repeatPassword"
              label="Repeat Password"
              type="password"
              name="repeatPassword"
              error={errors.repeatPassword && touched.repeatPassword}
            />
            <Flex sx={{ justifyContent: 'center', my: 3 }}>
              <Button type="submit">Passwort setzen</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
