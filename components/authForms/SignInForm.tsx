/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Box, Button, Flex, Label, Text,
} from 'theme-ui';
import {
  Formik, Form, Field, FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import { errorMonitor } from 'stream';
import { useAuth } from '../../lib/digitalstage/useAuth';
import InputField from '../InputField';
import { useErrors } from '../../lib/useErrors';

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

const SignInForm = () => {
  const { signInWithEmailAndPassword } = useAuth();
  const { reportError } = useErrors;

  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
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
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) => signInWithEmailAndPassword(
          values.email,
          values.password,
          values.staySignedIn,
        )
          .then(() => {
            resetForm(null);
          })
          .catch((err) => reportError(err.message))}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={InputField}
              id="email"
              label="Email"
              type="text"
              name="email"
              autocomplete="email"
              error={errors.email && touched.email}
            />
            <Field
              as={InputField}
              id="password"
              label="Password"
              name="password"
              type="password"
              autocomplete="current-password"
              error={errors.password && touched.password}
            />
            <Label sx={{ mt: 3 }}>
              <Field type="checkbox" name="staySignedIn" />
              <Text sx={{ fontSize: 14, ml: 2 }}>Remember me</Text>
            </Label>
            <Flex sx={{ justifyContent: 'center', my: 3 }}>
              <Button type="submit">Sign In</Button>
            </Flex>
          </Form>
        )}
      </Formik>

      <Flex sx={{ justifyContent: 'center', mt: 4, mb: 2 }}>
        <Button as="a" variant="text" href="/account/forgot">
          Forgot password?
        </Button>
      </Flex>
    </Box>
  );
};

export default SignInForm;
