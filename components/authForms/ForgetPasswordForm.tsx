/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Heading, Text, Flex, Button, Message } from 'theme-ui';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import InputField from '../InputField';
import { useAuth } from '../../lib/digitalstage/useAuth';

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
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    repeatEmail: Yup.string()
      .oneOf([Yup.ref('email'), null], 'Email must match')
      .required('Repeat email is required'),
  });

  return (
    <Box>
      <Box sx={{ textAlign: 'left' }}>
        <Heading as="h3" sx={{ my: 3, fontSize: 3 }}>
          Reset your password
        </Heading>
        <Text>Enter your email address to restore your password</Text>
      </Box>
      <Formik
        initialValues={{ email: '', repeatEmail: '' }}
        validationSchema={ForgetPasswordSchema}
        // eslint-disable-next-line max-len
        onSubmit={async (values: Values, { resetForm }: FormikHelpers<Values>) =>
          requestPasswordReset(values.email)
            .then((res) => {
              if (res === 200) {
                setMsg({
                  state: true,
                  type: 'success',
                  kids: 'Link sent - check your mails',
                });
                resetForm(null);
              } else if (res === 404) {
                setMsg({
                  state: true,
                  type: 'danger',
                  kids: 'Unknown email address',
                });
              } else {
                setMsg({
                  state: true,
                  type: 'warning',
                  kids: 'Oops - please try again',
                });
              }
            })
            .catch((err) => {
              setMsg({
                state: true,
                type: 'danger',
                kids: { err },
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
              label="E-mail"
              name="email"
              type="text"
              error={errors.email && touched.email}
            />
            <Field
              as={InputField}
              id="repeatEmail"
              label="Repeat Email"
              name="repeatEmail"
              type="text"
              error={errors.repeatEmail && touched.repeatEmail}
            />
            <Flex sx={{ justifyContent: 'center', my: 3 }}>
              <Button as="a" variant="white" href="/account/login">
                Cancel
              </Button>
              <Button type="submit">Send</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ForgetPasswordForm;
