/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useState } from 'react';
import { Typography, Container, makeStyles } from '@material-ui/core';

import validator from 'validator';
import { jsx, Flex, Button } from 'theme-ui';
import { BluetoothConnectedOutlined } from '@material-ui/icons';
import Input from '../base/Input';
import ButtonOld from '../base/Button';
import Checkbox from '../base/Checkbox';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Alert from '../base/Alert';

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
}));
export interface IError {
  email?: string;
  password?: string;
  response?: string;
}

export default function SignInForm(props: { onCompleted?: () => void }) {
  const { signInWithEmailAndPassword } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [errors, setErrors] = useState<IError>({});
  const classes = useStyles();

  const validate = () => {
    const errorsList: IError = {};
    if (validator.isEmpty(email)) {
      errorsList.email = 'Email is required';
    } else if (!validator.isEmail(email)) {
      errorsList.email = 'Enter a valid email';
    }
    if (validator.isEmpty(password)) {
      errorsList.password = 'Password is required';
    }
    setErrors(errorsList);
    return errorsList;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleCheckboxChange = (event) => setChecked(event.target.checked);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      return signInWithEmailAndPassword(email, password)
        .then(() => {
          if (props.onCompleted) {
            props.onCompleted();
          }
        })
        .catch((err) =>
          setErrors({
            response: err.message,
          })
        );
    }
  };

  return (
    <Container maxWidth="sm" className={classes.back}>
      <div className={classes.paper}>
        {errors && errors.response && (
          <Alert text={errors.response} severity="error" />
        )}
        <form noValidate onSubmit={handleSubmit}>
          <Input
            required
            id="email"
            placeholder="Email"
            name="email"
            type="text"
            error={errors && errors.email}
            onChange={handleEmailChange}
          />
          <Input
            required
            name="password"
            placeholder="Password"
            type="password"
            id="password"
            error={errors && errors.password}
            onChange={handlePasswordChange}
          />
          <Checkbox
            value="remember"
            label="Stay signed in"
            checked={checked}
            handleChange={handleCheckboxChange}
          />

          <Button type="submit">Sign In</Button>
        </form>
        <Flex sx={{ justifyContent: 'center', mt: 4, mb: 2 }}>
          <Button as="a" variant="text" href="/account/forgot">
            Forgot password?
          </Button>
        </Flex>
      </div>
    </Container>
  );
}
