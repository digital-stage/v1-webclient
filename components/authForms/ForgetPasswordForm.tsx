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
import { makeStyles } from '@material-ui/core';
import InputField from '../InputField';
import { useAuth } from '../../lib/digitalstage/useAuth';
import ResetLinkModal from './ResetLinkModal';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  back: {
    padding: theme.spacing(0),
    marginTop: theme.spacing(0),
  },
  text: {
    textAlign: 'left',
    padding: theme.spacing(2, 2, 0, 2),
  },
}));

interface IError {
  email?: string;
  repeatEmail?: string;
  response?: string;
}

const ForgetPasswordForm = (props) => {
  const classes = useStyles();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = React.useState<string>('');
  const [repeatEmail, setRepeatEmail] = React.useState<string>('');
  const [errors, setErrors] = React.useState<IError>({});
  const [open, setOpen] = React.useState(false);
  const [resend, setResend] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setResend(false);
  };

  const validate = () => {
    const errorsList: IError = {};
    if (validator.isEmpty(email)) {
      errorsList.email = 'Email is required';
    } else if (!validator.isEmail(email)) {
      errorsList.email = 'Enter a valid email';
    } else if (!validator.equals(email, repeatEmail)) {
      errorsList.email = 'Emails must be the same';
    }
    if (validator.isEmpty(repeatEmail)) {
      errorsList.repeatEmail = 'Email is required';
    } else if (!validator.isEmail(repeatEmail)) {
      errorsList.repeatEmail = 'Enter a valid email';
    } else if (!validator.equals(email, repeatEmail)) {
      errorsList.repeatEmail = 'Emails must be the same';
    }
    setErrors(errorsList);
    return errorsList;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleRepeatEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setRepeatEmail(e.target.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    return null;
  };

  const handleResend = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      return requestPasswordReset(email)
        .then(() => {
          if (props.onCompleted) props.onCompleted();
          setResend(true);
        })
        .catch((err) => {
          setErrors({
            response: err.message,
          });
          setResend(false);
        });
    }
    return null;
  };

  return (
    <Box>
      <ResetLinkModal
        open={open}
        handleClose={handleClose}
        onClick={handleResend}
        resend={resend}
      />

      <div className={classes.paper}>
        <Formik
          initialValues={{ email: '', repeatEmail: '' }}
          onSubmit={async (values) => requestPasswordReset(email)
            .then(() => {
              if (props.onCompleted) props.onCompleted();
              handleClickOpen();
            })
            .catch((err) => setErrors({
              response: err.message,
            }))}
        >
          <Form>
            <Field name="name" type="text" />
            <Field name="email" type="email" />
            <button type="submit">Submit</button>

            <Box sx={{ textAlign: 'left' }}>
              <Heading as="h3" sx={{ my: 3, fontSize: 3 }}>
                Reset your password
              </Heading>
              <Text>Enter your email address to restore your password</Text>
            </Box>

            <Field
              as={InputField}
              id="email"
              label="E-mail"
              name="email"
              type="text"
              error={errors && errors.email}
              onChange={handleEmailChange}
            />

            <Field
              as={InputField}
              id="repeatEmail"
              label="Repeat Email"
              name="repeatEmail"
              type="text"
              error={errors && errors.repeatEmail}
              onChange={handleRepeatEmailChange}
            />

            <Flex sx={{ justifyContent: 'center', my: 3 }}>
              <Button variant="white" onClick={props.onClick}>
                Cancel
              </Button>
              <Button type="submit">
                Reset
              </Button>
            </Flex>
          </Form>
        </Formik>
      </div>
    </Box>
  );
};

export default ForgetPasswordForm;
