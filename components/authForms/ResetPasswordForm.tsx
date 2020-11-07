/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import Router from 'next/router';
import {
  jsx, Box, Heading, Text, Flex, Button,
} from 'theme-ui';
import {
  Formik, Field, Form, FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import InputField from '../InputField';
import { useAuth } from '../../lib/digitalstage/useAuth';

interface Values {
  password?: string;
  repeatPassword?: string;
  response?: string;
}

export default function ResetPasswordForm(props: {resetToken: string}) {
  const { resetToken } = props;
  const { resetPassword } = useAuth();

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Too Short!')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        'Password must contain: at least one number, one uppercase and one lowercase letters and at least 8 chars',
      )
      .required('Password is required'),
    passwordRepeat: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Repeat password is required'),
  });

  return (
    <Box>
      <Formik
        initialValues={{
          password: '',
          repeatPassword: '',
        }}
        validationSchema={ResetPasswordSchema}
        onSubmit={(
          values: Values, { resetForm }: FormikHelpers<Values>,
        ) => resetPassword(resetToken, values.password)
          .then((res) => {
            console.log('res', res);
            Router.push('/account/login');
            resetForm(null);
          })
          .catch((err) => console.error(err))}
      >
        {({ errors, touched }) => (
          <Form>
            <Box sx={{ textAlign: 'left' }}>
              <Heading as="h3" sx={{ my: 3, fontSize: 3 }}>
                Set new password
              </Heading>
              <Text>
                Set a new password with 8 characters including 1 number and 1 uppercase letter
              </Text>
            </Box>
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
              <Button type="submit">Set password</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
