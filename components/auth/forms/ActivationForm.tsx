import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../lib/useAuth';
import { Button, Message, Flex } from 'theme-ui';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import translateError from '../translateError';
import Input from '../../../digitalstage-ui/elements/input/Input';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

export interface Values {
  code: string;
}

const ActivationForm = (props: { initialCode?: string }): JSX.Element => {
  const { initialCode } = props;
  const { push } = useRouter();
  const [message, setMessage] = useState<{
    type: 'danger' | 'warning' | 'info' | 'success';
    content: string;
  }>();
  const { loading, user, activate } = useAuth();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  const handleActivation = useCallback(
    (code: string) => {
      setMessage(undefined);
      return activate(code)
        .then(() => {
          setMessage({
            type: 'success',
            content: f('accountActivated'),
          });
          setTimeout(() => {
            push('/');
          }, 1000);
        })
        .catch((error) => {
          setMessage({
            type: 'danger',
            content: translateError(error),
          });
        });
    },
    [activate, push]
  );

  useEffect(() => {
    if (initialCode) handleActivation(initialCode);
  }, [initialCode, handleActivation]);

  useEffect(() => {
    if (!loading && user) {
      push('/');
    }
  }, [loading, user, push]);

  const notification = message ? <Message variant={message.type}>{message.content}</Message> : null;

  return (
    <div>
      {notification}
      <Formik
        initialValues={{
          code: '',
        }}
        validationSchema={Yup.object().shape({
          code: Yup.string().length(40).required(f('activationCodeRequired')),
        })}
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) => {
          return handleActivation(values.code).then(() => resetForm(null));
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={Input}
              id="code"
              label={f('activationCode')}
              type="text"
              name="code"
              error={errors.code && touched.code}
            />
            <Flex sx={{ justifyContent: 'center' }}>
              <Button type="submit">{f('activateAccount')}</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default ActivationForm;
