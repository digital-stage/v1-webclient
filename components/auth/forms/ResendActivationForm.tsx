import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/useAuth';
import { Button, Message, Flex, jsx, Box, Heading, Text } from 'theme-ui';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import translateError from '../translateError';
import Input from '../../../digitalstage-ui/elements/input/Input';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Link from 'next/link';

export interface Values {
  email: string;
}

const ResendActivationForm = (): JSX.Element => {
  const { push } = useRouter();
  const [message, setMessage] = useState<string>();
  const { loading, user, resendActivationLink } = useAuth();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  const Schema = Yup.object().shape({
    email: Yup.string().email(f('enterValidEmail')).required(f('emailRequired')),
  });

  useEffect(() => {
    if (!loading && user) {
      push('/');
    }
  }, [loading, user, push]);

  const notification = message ? <Message variant="danger">{message}</Message> : null;

  return (
    <div>
      <Box sx={{ textAlign: 'left' }}>
        <Heading as="h3" sx={{ mb: 7, fontSize: 3 }}>
          {f('sendActivationLink')}
        </Heading>
        <Text mb={5}>{f('enterEmailToActivate')}</Text>
      </Box>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={Schema}
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) => {
          setMessage(undefined);
          return resendActivationLink(values.email)
            .then(() => {
              resetForm(null);
            })
            .catch((err) => {
              setMessage(translateError(err));
            });
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={Input}
              id="email"
              label={f('emailAddress')}
              type="text"
              name="email"
              autocomplete="email"
              error={errors.email && touched.email}
            />
            {notification}
            <Flex sx={{ justifyContent: 'center', mt: 5, flexWrap: 'wrap' }}>
              <Link href="/account/login">
                <Button variant="tertiary">{f('cancel')}</Button>
              </Link>
              <Button type="submit">{f('send')}</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default ResendActivationForm;
