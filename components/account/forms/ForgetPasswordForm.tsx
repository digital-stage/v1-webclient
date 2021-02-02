/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Heading, Text, Flex, Button, Message } from 'theme-ui';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Input from '../../../digitalstage-ui/extra/Input';
import { useAuth } from '../../../lib/useAuth';
import Link from 'next/link';
import translateError from '../translateError';
import { useIntl } from 'react-intl';

interface Values {
  email: string;
  repeatEmail: string;
}

const ForgetPasswordForm = (): JSX.Element => {
  const { requestPasswordReset } = useAuth();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  const [msg, setMsg] = React.useState({
    state: false,
    type: null,
    kids: null,
  });

  const ForgetPasswordSchema = Yup.object().shape({
    email: Yup.string().email(f('enterValidEmail')).required(f('emailRequired')),
    repeatEmail: Yup.string()
      .oneOf([Yup.ref('email'), null], f('passwordMismatch'))
      .required(f('passwordConfirmRequired')),
  });

  return (
    <Box>
      <Box sx={{ textAlign: 'left' }}>
        <Heading as="h3" sx={{ mb: 7, fontSize: 3 }}>
          {f('resetPassword')}
        </Heading>
        <Text mb={5}>{f('enterEmailToReset')}</Text>
      </Box>
      <Formik
        initialValues={{ email: '', repeatEmail: '' }}
        validationSchema={ForgetPasswordSchema}
        // eslint-disable-next-line max-len
        onSubmit={async (values: Values, { resetForm }: FormikHelpers<Values>) =>
          requestPasswordReset(values.email)
            .then(() => {
              setMsg({
                state: true,
                type: 'success',
                kids: f('resetLinkSent'),
              });
            })
            .catch((err) => {
              setMsg({
                state: true,
                type: 'danger',
                kids: translateError(err),
              });
            })
        }
      >
        {({ errors, touched }) => (
          <Form>
            {msg.state && <Message variant={msg.type}>{msg.kids}</Message>}

            <Field
              as={Input}
              id="email"
              label={f('emailAddress')}
              name="email"
              type="text"
              error={errors.email && touched.email}
            />
            <Field
              as={Input}
              id="repeatEmail"
              label={f('emailConfirmation')}
              name="repeatEmail"
              type="text"
              error={errors.repeatEmail && touched.repeatEmail}
            />
            <Flex sx={{ justifyContent: 'center', mt: 5, flexWrap: 'wrap' }}>
              <Link href="/account/login">
                <Button variant="tertiary">{f('cancel')}</Button>
              </Link>
              <Button type="submit">{f('send')}</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ForgetPasswordForm;
