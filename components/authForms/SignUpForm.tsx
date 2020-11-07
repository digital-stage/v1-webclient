/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Box, Button, Flex,
} from 'theme-ui';
import {
  Formik, Form, Field, FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../lib/digitalstage/useAuth';
import InputField from '../InputField';
import Alert from '../base/Alert';
import { useErrors } from '../../lib/useErrors';
import ResetLinkModal from './ResetLinkModal';

interface Values {
  email: string;
  name: string;
  password: string;
  passwordRepeat: string;
}

const SignUpForm = () => {
  const { createUserWithEmailAndPassword } = useAuth();
  const { reportError } = useErrors();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

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
      <ResetLinkModal open={open} handleClose={handleClose} />

      <Formik
        initialValues={{
          email: '',
          name: '',
          password: '',
          passwordRepeat: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) => {
          console.log(values);
          return (
            createUserWithEmailAndPassword(
              values.email,
              values.password,
              values.name,
            )
              .then((res) => {
                // TODO: We need to check how we could refactor this
                handleClickOpen();
                resetForm(null);
              })
              .catch((err) => reportError(err))
              .finally()
          );
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={InputField}
              id="email"
              type="text"
              label="Email"
              // placeholder="Email"
              name="email"
              error={errors.email && touched.email}
            />

            <Field
              as={InputField}
              id="name"
              label="Username"
              // placeholder="Username"
              name="name"
              type="text"
              error={errors.name && touched.name}
            />
            <Field
              as={InputField}
              id="password"
              label="Password"
              // placeholder="Password"
              name="password"
              type="password"
              error={errors.password && touched.password}
            />
            <Field
              as={InputField}
              id="passwordRepeat"
              label="Repeat password"
              // placeholder="Repeat password"
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
