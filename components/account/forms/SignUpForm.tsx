/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Button, Flex, Message } from 'theme-ui';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../lib/useAuth';
import Input from '../../../digitalstage-ui/extra/Input';
import translateError from '../translateError';
import { useIntl } from 'react-intl';

interface Values {
  email: string;
  name: string;
  password: string;
  passwordRepeat: string;
}

const SignUpForm = (): JSX.Element => {
  const { createUserWithEmailAndPassword } = useAuth();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  const [message, setMessage] = React.useState<{
    type: 'danger' | 'warning' | 'info' | 'success';
    content: string;
  }>();

  const SignUpSchema = Yup.object().shape({
    email: Yup.string().email(f('enterValidEmail')).required(f('emailRequired')),
    name: Yup.string()
      .min(2, f('nameTooShort'))
      .max(70, f('nameTooLong'))
      .required(f('nameRequired')),
    password: Yup.string()
      .min(8, f('passwordMinLength'))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, f('passwordFormat'))
      .required(f('passwordRequired')),
    passwordRepeat: Yup.string()
      .oneOf([Yup.ref('password'), null], f('passwordMismatch'))
      .required(f('passwordConfirmRequired')),
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
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) => {
          setMessage(undefined);
          return createUserWithEmailAndPassword(values.email, values.password, values.name)
            .then(() => {
              resetForm(null);
              return setMessage({
                type: 'success',
                content: f('activationLinkSent'),
              });
            })
            .catch((err) =>
              setMessage({
                type: 'danger',
                content: translateError(err),
              })
            );
        }}
      >
        {({ errors, touched }) => (
          <Form>
            {message && <Message variant={message.type}>{message.content}</Message>}

            <Field
              as={Input}
              id="email"
              type="text"
              label={f('emailAddress')}
              name="email"
              error={errors.email && touched.email}
            />

            <Field
              as={Input}
              id="name"
              label={f('name')}
              name="name"
              type="text"
              error={errors.name && touched.name}
            />
            <Field
              as={Input}
              id="password"
              label={f('password')}
              name="password"
              type="password"
              error={errors.password && touched.password}
            />
            <Field
              as={Input}
              id="passwordRepeat"
              label={f('repeatPassword')}
              type="password"
              name="passwordRepeat"
              error={errors.passwordRepeat && touched.passwordRepeat}
            />
            <Flex sx={{ justifyContent: 'center', my: 3 }}>
              <Button type="submit">{f('doSignUp')}</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignUpForm;
