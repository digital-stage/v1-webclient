/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import Link from 'next/link';
import { jsx, Box, Button, Flex, Label, Text, Message, Checkbox } from 'theme-ui';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../lib/useAuth';
import Input from '../../../digitalstage-ui/extra/Input';
import translateError from '../translateError';
import { useIntl } from 'react-intl';

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
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  const [message, setMessage] = React.useState<{
    type: 'danger' | 'warning' | 'info' | 'sucess';
    content: string;
  }>();

  const SignInSchema = Yup.object().shape({
    email: Yup.string().email(f('enterValidEmail')).required(f('emailRequired')),
    password: Yup.string().required(f('passwordRequired')),
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
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) => {
          setMessage(undefined);
          return signInWithEmailAndPassword(values.email, values.password, values.staySignedIn)
            .then(() => {
              resetForm(null);
            })
            .catch((err) => {
              setMessage({
                type: 'danger',
                content: translateError(err),
              });
            });
        }}
      >
        {({ errors, touched }) => (
          <Form>
            {message && <Message variant={message.type}>{message.content}</Message>}

            <Field
              as={Input}
              id="email"
              label={f('emailAddress')}
              type="text"
              name="email"
              autocomplete="email"
              error={errors.email && touched.email}
            />
            <Field
              as={Input}
              id="password"
              label={f('password')}
              name="password"
              type="password"
              autocomplete="current-password"
              error={errors.password && touched.password}
            />
            <Label sx={{ mt: 3 }}>
              <Field as={Checkbox} type="checkbox" name="staySignedIn" />
              <Text sx={{ fontSize: 14, ml: 2 }}>{f('staySignedIn')}</Text>
            </Label>
            <Flex sx={{ justifyContent: 'center', my: 3 }}>
              <Button type="submit">{f('doLogin')}</Button>
            </Flex>
          </Form>
        )}
      </Formik>

      <Flex sx={{ justifyContent: 'center', mt: 4, mb: 2 }}>
        <Link href="/account/forgot">
          <Button variant="text">{f('forgotPassword')}</Button>
        </Link>
      </Flex>

      <Flex sx={{ justifyContent: 'center', mt: 4, mb: 2 }}>
        <Link href="/account/reactivate">
          <Button variant="text">{f('resendActivationLink')}</Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default SignInForm;
