/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Box, Button, Flex, Message,
} from 'theme-ui';
import {
  Formik, Form, Field, FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../lib/digitalstage/useAuth';
import InputField from '../InputField';
import { useErrors } from '../../lib/useErrors';

interface Values {
  email: string;
  name: string;
  password: string;
  passwordRepeat: string;
}

const SignUpForm = () => {
  const { createUserWithEmailAndPassword } = useAuth();
  const { reportError } = useErrors();

  const [msg, setMsg] = React.useState({
    state: false,
    type: null,
    kids: null,
  });

  const SignUpSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(70, 'Too Long!')
      .required('Username is required'),
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
          email: '',
          name: '',
          password: '',
          passwordRepeat: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) => createUserWithEmailAndPassword(
          values.email,
          values.password,
          values.name,
        )
          .then((res) => {
            if (res === 201) {
              setMsg({
                state: true,
                type: 'success',
                kids: 'Please log in to your new account',
              });
              resetForm(null);
            } else {
              setMsg({
                state: true,
                type: 'warning',
                kids: 'Oops - please try again',
              });
            }
          })
          .catch((err) => setMsg({
            state: true,
            type: 'danger',
            kids: { err },
          }))}
      >
        {({ errors, touched }) => (
          <Form>
            {msg.state && <Message variant={msg.type}>{msg.kids}</Message>}

            <Field
              as={InputField}
              id="email"
              type="text"
              label="Email"
              name="email"
              error={errors.email && touched.email}
            />

            <Field
              as={InputField}
              id="name"
              label="Username"
              name="name"
              type="text"
              error={errors.name && touched.name}
            />
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
              id="passwordRepeat"
              label="Repeat password"
              type="password"
              name="passwordRepeat"
              error={errors.passwordRepeat && touched.passwordRepeat}
            />

            <Flex sx={{ justifyContent: 'center', my: 3 }}>
              <Button type="submit">Sign Up</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignUpForm;
